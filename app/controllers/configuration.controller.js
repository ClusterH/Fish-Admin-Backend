const db = require("../models");
const FishType = db.fishType;
const Banner = db.banner;

exports.registerFishType = (req, res) => {
    const data = {
        name: req.body.name,
        createdDate: new Date(),
    };

    FishType.create(data)
        .then(data => {
            return res.status(200).send({result: data, message: 'FISH_TYPE_REGISTER_SUCCESS'});
        })
        .catch(err => {
            return res.status(500).send({msg: err.toString()});
        })
};

exports.getAllFishTypes = (req, res) => {
    FishType.findAll()
        .then(data => {
            return res.status(200).send({result: data});
        }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
};

exports.getFishTypeById = (req, res) => {
    const fishTypeId = req.body.fishTypeId;
    FishType.findOne({
        where: {id: fishTypeId}
    }).then((data) => {
        return res.status(200).send({result: data});
    }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
};

exports.updateFishType = async (req, res) => {
    const fishTypeId = req.body.fishTypeId;

    try {
        const fishType = await FishType.findOne({
            where: {id: fishTypeId}
        });

        if (!fishType) {
            return res.status(404).send({msg: 'FISH_TYPE_NOT_FOUND'});
        }

        const keys = Object.keys(req.body);
        for (const key of keys) {
            if (key !== 'fishTypeId') {
                fishType[key] = req.body[key];
            }
        }
        await fishType.save();

        return res.status(200).send({result: 'FISH_TYPE_UPDATE_SUCCESS'});

    } catch (err) {
        return res.status(500).send({msg: err.toString()});
    }
};

exports.deleteFishType = (req, res) => {
    const fishTypeId = req.body.fishTypeId;

    FishType.destroy({
        where: {id: fishTypeId}
    }).then(data => {
        return res.status(200).send({result: 'FISH_TYPE_DELETE_SUCCESS'});
    }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
};


exports.registerBanner = (req, res) => {
    const data = {
        title: req.body.title,
        subtitle: req.body.subtitle,
        image: req.body.image,
    };

    Banner.create(data)
        .then(data => {
            return res.status(200).send({result: 'BANNER_REGISTER_SUCCESS', data: data});
        })
        .catch(err => {
            return res.status(500).send({msg: err.toString()});
        })
};

exports.getAllBanner = (req, res) => {
    Banner.findAll({
        limit: req.body.limit || 1000000,
        offset: req.body.offset || 0,
        order: [['updatedDate', 'DESC']]
    }).then(data => {
        return res.status(200).send({result: data});
    }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
};

exports.deleteBanner = (req, res) => {
    const bannerId = req.body.bannerId;

    FishType.destroy({
        where: {id: bannerId}
    }).then(data => {
        return res.status(200).send({result: 'BANNER_DELETE_SUCCESS'});
    }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
};
