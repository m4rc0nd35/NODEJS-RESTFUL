const express = require("express");
const router = express.Router();
const controller = require('../Controllers/authentication');

module.exports = router.post('/', controller.authentication);