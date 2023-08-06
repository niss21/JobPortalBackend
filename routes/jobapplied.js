const express = require("express");
const router = express.Router();

const { getAppliedjobs,appliedjobs } = require("../controller/jobapplied");
const { checkAuthentication, isApplicant } = require("../middleware/auth");

router.get("/appliedjob", checkAuthentication, getAppliedjobs)
router.post("/applyjob", checkAuthentication, isApplicant,appliedjobs)

module.exports = router;
