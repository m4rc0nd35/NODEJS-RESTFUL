const jwt = require("jsonwebtoken");

module.exports = (req, res, next)=>{
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        req.decode = decode;
        next();
    } catch (error) {
        return res.status(401).send({
            mensagem: 'Token error'
        });
    }
}