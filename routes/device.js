const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const checkTokenUser = require("../checkTokenUser");

router.get("/", checkTokenUser, (req, res, next) =>{
    mysql.getConnection((error, conn)=>{
        if(error) return res.status(500).send({ error: error});
        conn.query('SELECT * FROM VIEW_DEVICE;',
            (error, fecthAll, field)=>{
                conn.release();
                if(error) return res.status(500).send({ error: error});
                if(fecthAll.length == 0) return res.status(404).send({error: "Sem registros para essa consulta."});
                
                const response = {
                    quantidade: fecthAll.length,
                    devices: fecthAll.map(dev=>{
                        return {
                            id: dev.id,
                            client_id: dev.client_id,
                            username: dev.username,
                            publish_acl: dev.publish_acl,
                            subscribe_acl: dev.subscribe_acl
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )
    });
});

router.patch("/", checkTokenUser, (req, res, next) =>{
    mysql.getConnection((error, conn)=>{
        if(error) return res.status(500).send({ error: error});
        conn.query('CALL SP_UPDATE_DEVICE(?, @test); SELECT @test;',
            [req.body.id],
            (error, fetchOne, field)=>{
                // conn.commit(function(err) {
                //     if (err) { 
                //         conn.rollback(function() {
                //         throw err;
                //       });
                //     }
                // });
                if(error){
                    conn.rollback();
                    return res.status(500).send({ error: error});
                }
                conn.release();
                return res.status(202).send({success: fetchOne[1][0]['@test']});
            }
        )
    });
});

module.exports = router;