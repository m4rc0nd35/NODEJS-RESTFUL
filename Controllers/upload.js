const fs = require('fs');

exports.file_post = (req, res, next)=>{
    var listFileType = ['image/png' ,'application/pdf'];
    if (listFileType.includes(req.file.mimetype)) {
        return res.status(202).send(req.file);
    } else {
        fs.unlinkSync(req.file.path);
        return res.status(415).send({save: false});
    }
}