const express = require("express");
const router = express.Router();

const linkController = require("../controllers/linkController");
const Limiter = require("../utils/rateLimiter");

router.post("/", Limiter.createLinkLimiter, linkController.createLink);
router.get("/:shortCode", linkController.getURl);
router.get("/:shortCode/analytics", linkController.getAnalytics);


module.exports = router;
