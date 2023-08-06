const Jobs = require("../model/job")
const postjobs = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Please upload an image" });
        }
        let images = req.file.filename
        let jobs = await Jobs.create({ ...req.body, created_by: req.user._id, images })
        res.send(jobs)
    }
    catch (err) {
        next(err)
    }
}

const putjob = async (req, res, next) => {
    let db_jobs = await Jobs.findById(req.params.id)
    let recruiter_id = db_jobs.created_by
    if (req.user._id != recruiter_id) {
        return res.status(403).send({
            data: "Not valid seller.. "
        })
    }
    try {
        let images = req.file.filename
        let jobs = await Jobs.findByIdAndUpdate(req.params.id, { ...req.body, created_by: req.user._id, images },{ new: true })
        res.send(jobs)
    } catch (error) {
        next(error);
    }
}

const deletejob = async (req, res, next) => {
    try {
        let db_jobs = await Jobs.findById(req.params.id)
        let recruiter_id = db_jobs.created_by
        if (req.user._id != recruiter_id) {
            return res.status(403).send({
                data: "Not valid seller.. "
            })
        }
        let jobs = await Jobs.findByIdAndDelete(req.params.id)
        res.send({
            data: jobs
        })
    }
    catch (err) {
        next(err);
    }
}

const getjobs = async (req, res, next) => {
    let per_page = parseInt(req.query.per_page) || 9;
    let page = parseInt(req.query.page) || 1;
    let sortBy = req.query.sortBy || 'posted_date';
    let category = req.query.category || "All";

    const categoryOptions = [
        "Frontend",
        "Backend",
        "Web developer",
        "Cybersecurity",
        "Management",
        "HR",
        "Graphics designer",
        "video editor",
        "Software developer",
        "App developer",
    ];

    let matchQuery = {
        $or: [
            { title: RegExp(`${req.query.search_term}`, "i") },
            { company: RegExp(`${req.query.search_term}`, "i") },
            { location: RegExp(`${req.query.search_term}`, "i") }
        ]
    };

    if (category !== "All") {
        if (Array.isArray(category)) {
            matchQuery.category = { $in: category };
        } else {
            matchQuery.category = category;
        }
    } else {
        matchQuery.category = { $in: categoryOptions };
    }

    let sortStage = { [sortBy]: 1 };

    let jobs = await Jobs.aggregate([
        {
            $match: matchQuery
        },
        {
            $lookup: {
                from: "users",
                localField: "created_by",
                foreignField: "_id",
                as: "created_by"
            }
        },
        {
            $unwind: "$created_by"
        },
        {
            $project: {
                "created_by.password": 0
            }
        },
        {
            $sort: sortStage
        },
        {
            $skip: (page - 1) * per_page
        },
        {
            $limit: per_page
        },
    ]);

    let jobsCountPipeline = [
        {
            $match: matchQuery
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 }
            }
        }
    ];

    let jobsCount = await Jobs.aggregate(jobsCountPipeline);
    res.send({
        meta: {
            total: jobsCount[0]?.total || 0,
            page,
            per_page
        },
        data: jobs,
        categories: categoryOptions,
    });
}

const getalljobs = async (req, res, next) => {
    try {
        const allJobs = await Jobs.find({});
        res.send({
            data: allJobs,
        })
    } catch (error) {
        next(error)
    }
}

const postedjobs = async (req, res, next) => {
    try {
        const jobs = await Jobs.find({ created_by: req.params.id }).exec();
        res.send({
            data: jobs,
        })
    } catch (err) {
        next(err)
    }
};

const getjobbyid = async (req, res, next) => {
    try {
        let jobs = await Jobs.findById(req.params.id)
        res.send(jobs);
    }
    catch (err) {
        next(err);
    }
}

module.exports = {
    getjobs,
    getalljobs,
    getjobbyid,
    putjob,
    deletejob,
    postjobs,

    postedjobs
}

