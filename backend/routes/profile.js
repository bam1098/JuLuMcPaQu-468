const express = require("express");
const router = express.Router();
const { getPrivateData } = require("../controllers/profile");
const { protect } = require("../middleware/auth");

router.route("/").get(protect, getPrivateData);

module.exports = router;
