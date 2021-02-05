
module.exports = (req, res, next)=>{
    const token = req.headers.authorization.split(' ')[1];
        
    console.log(token);
    return res.status(401).send({
        mensagem: 'Token device error'
    });
}