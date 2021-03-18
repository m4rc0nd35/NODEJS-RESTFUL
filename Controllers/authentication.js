const jwt = require("jsonwebtoken");
const mysql = require("../mysql");

exports.authentication = async (req, res, next)=>{	
	try {
		const result = await mysql.execute(
			'CALL SP_LOGIN(?, ?, @token, @success); SELECT @token, @success;', 
			[req.body.username, req.body.password]
		);
		console.log(result);
		if(result[1][0]["@success"]){
			const token = jwt.sign({
				key: result[1][0]["@token"]
			},
			process.env.SECRET_KEY,{
				expiresIn: 600
			});
			return res.status(202).send({
				mensagem: 'Autenticado com sucesso!',
				token: token
			});
		}else{
			return res.status(401).send({
				mensagem: 'Autenticação negada!',
				token: false
			});
		}	
	} catch (error) {
		return res.status(500).send({ error: error});
	}
}