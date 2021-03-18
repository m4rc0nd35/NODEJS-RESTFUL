const mysql = require('mysql');

const pool = mysql.createPool({
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DB,
	host: process.env.MYSQL_HOST,
	port: process.env.MYSQL_PORT,
	timezone: '+00:00',
	multipleStatements: true
});
exports.execute = (query, params = []) => {
	return new Promise((resolve, reject) => {
		pool.getConnection((error, conn) => {
			if (error)
				reject(error);
			else {
				conn.query(query, params, (error, result, field) => {
					conn.release();
					if (error)
						reject(error);
					else {
						resolve(result);
					}
				});
			}
		});
	});
}