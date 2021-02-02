const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) =>{
    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({ error: error})}
        conn.query('SELECT * FROM VIEW_DEVICE WHERE id = ?;',
            [req.body.id],
            (error, results, field)=>{
                conn.release();
                if(error){return res.status(500).send({ error: error})}
                if(results.length == 0){return res.status(404).send({ error: "Sem registros para essa consulta."})}
                
                const response = {
                    quantidade: results.length,
                    devices: results.map(dev=>{
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

router.post("/", (req, res, next) =>{
    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({ error: error})}
        var out;
        conn.query('CALL SP_UPDATE_DEVICE(?);',
            [req.body.id],
            (error, resultado, field)=>{
                conn.commit(function(err) {
                    if (err) { 
                        conn.rollback(function() {
                        throw err;
                      });
                    }
                });
                if(error){
                    conn.rollback();
                    return res.status(500).send({ error: error})
                }
                conn.release();
                return res.status(202).send({ affectedRows: resultado.affectedRows })
            }
        )
    })
});

module.exports = router;