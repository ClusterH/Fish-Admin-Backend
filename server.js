const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require('path');
const cors = require("cors");
const filesRouter = require("./app/file_upload.routes");
const eventRouter = require("./app/controllers/event.controller");

// cors policy
const corsOptions = {
    "origin": "*",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json({limit: '10mb'}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));

// configuration for file upload
app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static("public"));
app.use('/file', filesRouter);

// Event Handler using SSE
app.use('/events', eventRouter);

// database model
const db = require("./app/models");

db.sequelize.sync().then(res => {
    // db.sequelize.sync({alter: true});
    db.sequelize.sync();
});


app.get("/", (req, res) => {
    res.json({msg: ["Welcome to fishing app"]});
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/competition.routes')(app);
require('./app/routes/post.routes')(app);
require('./app/routes/configuration.routes')(app);
// require('./app/routes/diary.routes')(app);
require('./app/routes/fish.routes')(app);
require('./app/routes/notice.routes')(app);
require('./app/routes/question.routes')(app);
require('./app/routes/report.routes')(app);
require('./app/routes/terms.routes')(app);
require('./app/routes/withdrawal.routes')(app);
require('./app/routes/dashboard.routes')(app);


// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});


