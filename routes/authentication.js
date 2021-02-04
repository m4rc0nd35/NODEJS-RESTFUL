const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const jwt = require("jsonwebtoken");

router.post('/', (req, res, next)=>{
    mysql.getConnection((error, conn)=>{
        if(error) return res.status(500).send({ error: error});
        conn.query('CALL SP_LOGIN(?, ?, @token, @success); SELECT @token, @success;',
            [
                req.body.username, 
                req.body.password
            ],
            (error, fetchOne, field)=>{
                conn.release();
                if(error){
                    conn.rollback();
                    return res.status(500).send({ error: error});
                }
                if(fetchOne[1][0]["@success"]){
                    const token = jwt.sign({
                        id_user: fetchOne[1][0]["@token"]
                    },
                    process.env.SECRET_KEY,{
                        expiresIn: 600
                    }
                    );
                    return res.status(202).send({
                        mensagem: 'Autenticado com sucesso!',
                        token: token,
                        fetchOne: fetchOne[1][0]
                    });
                }else{
                    return res.status(401).send({
                        mensagem: 'Autentição negada!',
                        token: false
                    });
                }
            }
        );
    });
})
module.exports = router;