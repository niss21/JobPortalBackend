const Jobapplied = require("../model/jobapplied")

const getAppliedjobs = async (req, res, next) => {
    
    let jobsapplied = await Jobapplied.find({ created_by: req.user._id })
    .populate({path:'jobs.job_id', select:[ 'title', 'location','posted_date','closing_date' ]});
    res.send(jobsapplied);
    
}

const appliedjobs = async (req, res, next) => {
    try {
        let jobapplied = await Jobapplied.create({
            jobs: req.body.jobs,
            created_by: req.user._id
        })
        res.send(jobapplied)
    }
    catch (err) {
        next(err)
    }
}

module.exports = {
    getAppliedjobs,
    appliedjobs
}