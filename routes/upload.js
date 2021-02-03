const express = require("express");
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
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

router.post('/', uploads.single('put_image'), (req, res, next)=>{
    if (req.file.mimetype === 'image/png') {
        return res.status(202).send(req.file);
    } else {
        fs.unlinkSync(req.file.path);
        console.log(req.file.path);
        return res.status(415).send({success: false});
    }
})

router.get('/', (req, res, next)=>{
    return res.status(200).send(res);
})
module.exports = router;