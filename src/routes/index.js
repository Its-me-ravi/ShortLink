const linkRoute = require("./linkRoute");
const express = require("express");
const router = express.Router();

router.use("/link", linkRoute);

module.exports = router;
