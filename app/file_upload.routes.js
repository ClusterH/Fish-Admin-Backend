const express = require('express');
const router = express.Router();
const multer = require('multer');
const {v4: uuidv4} = require('uuid');
const db = require("./models");
const conf = require("./config/auth.config");

const DIR = "./public/files";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

let upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/svg+xml" ||
            file.mimetype == "text/plain" ||
            file.mimetype == "text/csv" ||
            file.mimetype == "application/vnd.ms-excel"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg, .jpeg and .txt format allowed!'));
        }
    }
});

router.post("/upload", upload.single('selectedFile'), (req, res, next) => {
    const fileUrl = req.file.filename;
    const fullPath = conf.BASE_URL + "/public/files/" + fileUrl;
    console.log(fullPath);
    return res.status(200).json({result: fileUrl, fullPath: fullPath});
});

module.exports = router;
