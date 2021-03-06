const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const deviceRouter = require("./Routes/device");
const uplodsRouter = require('./Routes/upload');
const loginRouter = require('./Routes/authentication');

app.use('/static', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH');
    next();
});

app.use("/device", deviceRouter);
app.use('/upload', uplodsRouter);
app.use('/authentication', loginRouter);

app.use((req, res, next) =>{
    const erro = new Error("Pagina não encontrada");
    erro.status = 404;
    next(erro);
});
app.use((error, req, res, next) =>{
    return res.status(error.status || 500).send({erro: {mensagem: error.message}});
});

module.exports = app;