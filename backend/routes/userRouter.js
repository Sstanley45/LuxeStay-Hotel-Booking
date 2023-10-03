const express = require("express");
const router = express.Router();

const showCurrentUser = require("../controllers/userControllers");

const authenticateUser = require("../middleware/authenticate");

router.route("/showMe").get(authenticateUser, showCurrentUser);

module.exports = router;
