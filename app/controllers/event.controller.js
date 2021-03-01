const express = require('express');
const router = express.Router();
const db = require("../models");
const User = db.users;
const LoginUser = db.loginUsers;
const Appointment = db.appointments;
const AppointmentType = db.appointmentType;
const Department = db.departments;
const Puesto = db.puestos;
const AgentPuesto = db.agentPuesto;
const AppointmentHistory = db.appointmentHistory;
const Incident = db.incidents;
const AppContract = db.appsContract;
const Device = db.devices;
const Op = db.Sequelize.Op;
const global = require('../utils/global');


router.all("/appointment", async (req, res, next) => {
    const userInfo = JSON.parse(req.query.user);
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    const profile = userInfo.idPerfil;
    const userId = userInfo.id;

    // db.appointments.hasOne(db.users, {sourceKey: 'idAgenteAsignado', foreignKey: 'id'});
    // db.users.belongsTo(db.appointments, {foreignKey: 'idAgenteAsignado'});
    db.appointmentHistory.hasOne(db.appointments, {sourceKey: 'idCita', foreignKey: 'id'});
    db.appointments.belongsTo(db.appointmentHistory, {foreignKey: 'idCita'});

    let pendingPanels = null;

    if (profile === 1) {
        pendingPanels = await Puesto.findAll({
            attributes: ['id', 'nomPuesto'],
            include: [{
                model: Appointment,
                where: {idEstado: 1},
                attributes: ['id', 'descAsunto', 'fechahoraPrevista', 'idEstado', 'esCita'],
                include: [{
                    model: LoginUser,
                    attributes: ['id', 'username', 'email', 'telefono']
                }, {
                    model: AppointmentType,
                    attributes: ['id', 'codTipoAtencion']
                }]
            }]
        });
    } else {
        const user = await User.findOne({
            where: {idloginUsuario: userId}
        });

        pendingPanels = await AgentPuesto.findAll({
            where: {
                idUsuario: user.id,
            },
            include: [{
                model: Puesto,
                attributes: ['id', 'nomPuesto'],
                include: [{
                    model: Appointment,
                    where: {idEstado: 1},
                    attributes: ['id', 'descAsunto', 'fechahoraPrevista', 'idEstado', 'esCita'],
                    include: [{
                        model: LoginUser,
                        attributes: ['id', 'username', 'email', 'telefono']
                    }, {
                        model: AppointmentType,
                        attributes: ['id', 'codTipoAtencion']
                    }]
                }]
            }],
            attributes: ['id', 'idRolAtencion']
        });
    }
    const attendingPanel = await AppointmentHistory.findAll({
        where: {
            idAgente: userInfo.id,
        },
        limit: 1,
        order: [['fechaEstado', 'DESC']],
        attributes: ['id'],
        include: [{
            model: Appointment,
            attributes: ['id', 'descAsunto', 'fechahoraPrevista', 'idEstado', 'esCita', 'idPuesto'],
            include: [{
                model: LoginUser,
                attributes: ['id', 'username', 'email', 'telefono']
            }, {
                model: AppointmentType,
                attributes: ['id', 'codTipoAtencion']
            }]
        }]
    });
    const data = {
        'method': 'INITIAL',
        'pendingPanels': pendingPanels,
        'attendingPanel': attendingPanel,
    }

    const sseFormattedResponse = `data: ${JSON.stringify(data)}\n\n`;
    // const sseFormattedResponse = `HTTP/1.1 200\ndata: ${JSON.stringify({appointments: data})}\n\n`;
    res.write(sseFormattedResponse);
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = {
        id: clientId,
        reqType: "APPOINTMENT_STATUS",
        res
    };
    usersForAppointmentStatus.push(newClient);
    console.log(usersForAppointmentStatus.length);

    req.on('close', () => {
        const idx = usersForAppointmentStatus.findIndex(x => x.id !== clientId);
        if (idx > -1) {
            usersForAppointmentStatus.splice(idx, 1);
        }
    });
});

router.all("/dashboard", async (req, res, next) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    const departmentCount = await Department.count();
    const puestoCount = await Puesto.count();

    let agentCount = 0;
    let managerCount = 0;
    const users = await User.findAll({
        attributes: ['id'],
        include: [{
            model: AgentPuesto,
            attributes: ['id', 'idRolAtencion']
        }]
    });

    for (const user of users) {
        const idx1 = user.agentespuestos.findIndex(x => x.idRolAtencion === 1);
        const idx2 = user.agentespuestos.findIndex(x => x.idRolAtencion === 2);

        if (idx1 > -1) agentCount += 1;
        if (idx2 > -1) managerCount += 1;
    }

    const adminCount = await LoginUser.count({
        where: {
            idPerfil: [1, 2],
        }
    });
    const totalUserCount = await LoginUser.count();
    const pendingAppt = await Appointment.count({where: {idEstado: 1}});

    const currentTime = new Date();
    const next30min = await Appointment.count({
        where: {
            idEstado: [1, 2],
            fechahoraPrevista: {
                [Op.and]: [{
                    [Op.lte]: currentTime.getTime() + 1800000,
                }, {
                    [Op.gte]: currentTime.getTime(),
                }]

            }
        }
    });
    const more30min = await Appointment.count({
        where: {
            idEstado: [1, 2],
            fechahoraPrevista: {
                [Op.gt]: currentTime.getTime() + 1800000,
            }
        }
    });

    const appointmentOnHold = await Appointment.count({where: {idEstado: 2}});
    const incidentOnHold = await Incident.count({where: {idEstado: 2}});
    const immediateAppt = await Appointment.count({where: {esCita: 0}});
    const attendedAppt = await Appointment.count({where: {idEstado: 3}});
    const assignedIncident = await Incident.count({where: {idEstado: 3}});

    const totalSPCount = await Device.count({
        where: {
            device: ["ANDROID", "IOS", "OTHER"]
        }
    });
    const androidCount = await Device.count({where: {device: "ANDROID"}});
    const iosCount = await Device.count({where: {device: "IOS"}});
    const totalPCCount = await Device.count({
        where: {
            device: ["WINDOWS", "MAC", "LINUX"]
        }
    });
    const windowsCount = await Device.count({where: {device: "WINDOWS"}});
    const macCount = await Device.count({where: {device: "MAC"}});
    const win10Count = await Device.count({where: {device: "WINDOWS", version: 10}});
    const win8Count = await Device.count({where: {device: "WINDOWS", version: 8}});
    const win7Count = await Device.count({where: {device: "WINDOWS", version: 7}});
    const winXpCount = await Device.count({where: {device: "WINDOWS", version: "Xp"}});
    const linuxCount = await Device.count({where: {device: "LINUX"}});

    const data = {
        departmentCount,
        puestoCount,
        agentCount,
        managerCount,
        adminCount,
        totalUserCount,
        pendingAppt,
        next30min,
        more30min,
        appointmentOnHold,
        incidentOnHold,
        immediateAppt,
        attendedAppt,
        assignedIncident,
        totalSPCount,
        iosCount,
        androidCount,
        totalPCCount,
        windowsCount,
        macCount,
        win10Count,
        win8Count,
        win7Count,
        winXpCount,
        linuxCount,
    }

    const sseFormattedResponse = `data: ${JSON.stringify({dashboardInfo: data})}\n\n`;
    res.write(sseFormattedResponse);
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = {
        id: clientId,
        reqType: "DASHBOARD",
        res
    };
    usersForDashboard.push(newClient);

    req.on('close', () => {
        const idx = usersForDashboard.findIndex(x => x.id !== clientId);
        if (idx > -1) {
            usersForDashboard.splice(idx, 1);
        }
    });
});

module.exports = router;
