const express = require("express");
const router = express.Router();
const authenticateUser = require('../middleware/authenticate')


const {
  register,
  login,
  verifyEmail,
  logOut,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");


router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.delete("/logout",authenticateUser, logOut);
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword);


module.exports = router;
