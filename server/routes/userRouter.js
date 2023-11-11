const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  showCurrentUser,
} = require("../controllers/userControllers");

const authenticateUser = require("../middleware/authenticate");

router.route("/showMe").get(authenticateUser, showCurrentUser);
router.get("/getAllUsers", getAllUsers);


module.exports = router;
