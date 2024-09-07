const express = require("express");
const router = express.Router();

const verifyUser = require("../middlewares/userVerify");
const linkController = require("../controllers/linkController");
const loginLimiter = require("../utils/rateLimiter");

router.post("/register", linkController.register);
router.post("/login", linkController.login);
router.get("/user", linkController.users);

module.exports = router;
