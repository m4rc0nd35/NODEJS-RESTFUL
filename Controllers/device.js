const mysql = require("../mysql");

exports.device_all = async (req, res, next) =>{
	try {
		const fecthAll = await mysql.execute('SELECT * FROM VIEW_DEVICE;');
		
		if(fecthAll.length == 0) return res.status(404).send({
			error: "Sem registros para essa consulta."
		});
		
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
	} catch (error) {
		if(error) return res.status(500).send({ error: error});
	}
}

exports.device = async (req, res, next) =>{
	try {
		const fetchOne = mysql.execute('CALL SP_UPDATE_DEVICE(?, @test); SELECT @test;',[req.body.id]);

		return res.status(200).send({ fetchOne: fetchOne});
	} catch (error) {
		return res.status(500).send({ error: error});
	}
}