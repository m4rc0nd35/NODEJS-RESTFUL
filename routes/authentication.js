const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const jwt = require("jsonwebtoken");

router.post('/', (req, res, next)=>{
    mysql.getConnection((error, conn)=>{
        if(error) return res.status(500).send({ error: error});
        // conn.query('CALL SP_LOGIN(?, ?, @token, @success); SELECT @token, @success;',
        //     [req.body.username, req.body.password],
        //     (error, fetchOne, field)=>{
        //         conn.release();
        //         if(error){
        //             conn.rollback();
        //             return res.status(500).send({ error: error});
        //         }
        //         return res.status(202).send(fetchOne);
        //     }
        // );
    });
    const token = jwt.sign({
        id_user: req.body.username
    },
    process.env.SECRET_KEY,
    );
    return res.status(200).send({
        mensagem: 'Autenticado com sucesso!',
        token: token
    });
})
module.exports = router;