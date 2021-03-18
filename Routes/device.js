const express = require("express");
const router = express.Router();
const checkTokenUser = require("../checkTokenUser");
const controller = require("../Controllers/device");

router.get("/", checkTokenUser, controller.device_all);
router.patch("/", checkTokenUser, controller.device);

module.exports = router;