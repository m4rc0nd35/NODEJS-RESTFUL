const express = require("express");
const router = express.Router();
const checkTokenUser = require("../checkTokenUser");
const controller = require("../Controllers/upload")
const multer = require('multer');
const md5 = require('md5');
const storage = multer.diskStorage({
    destination: function(req, file, callack){
        callack(null, './uploads/');
    },
    filename: function(req, file, callback){
        callback(null, md5(new Date().toString())+'.'+ file.mimetype.split('/')[1])
    }
});

const uploads = multer({
    storage: storage,
    limits: {
        fileSize: (1024*1024)
    }
    // fileFilter: fileFilter
});

router.post('/', checkTokenUser, uploads.single('put_image'), controller.file_post);

module.exports = router;