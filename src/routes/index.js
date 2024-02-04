const express = require("express");
const router = express.Router();
const v1ApiRouters = require("./v1/index");

router.use("/v1", v1ApiRouters);

module.exports = router;