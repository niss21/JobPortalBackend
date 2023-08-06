const express = require("express");
const router = express.Router();

const upload = require("../multerconfig/config")
const { isRecruiter, checkAuthentication } = require("../middleware/auth")
const { getalljobs,getjobs,getjobbyid,postjobs,putjob,deletejob,postedjobs } = require("../controller/jobs");

router.get("/jobs", getjobs)
router.get("/alljobs", getalljobs)

router.post("/job", checkAuthentication, isRecruiter, upload.single('images'), postjobs)
router.put("/job/:id", checkAuthentication, isRecruiter, upload.single('images'),putjob)
router.get("/job/:id", getjobbyid)
router.delete("/job/:id", checkAuthentication, isRecruiter, deletejob)

router.get("/postedjobs/:id",checkAuthentication, isRecruiter, postedjobs)

module.exports = router;