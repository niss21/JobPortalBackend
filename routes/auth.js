const express = require('express');
const router = express.Router();

const { login, signup, getuser, getuserdata } = require("../controller/auth")
const { login_middeware } = require("../middleware/auth")

router.post("/login", login_middeware, login);
router.post("/signup", signup);
router.get("/user", getuser);
router.get("/getuserdata", getuserdata);

module.exports = router;
