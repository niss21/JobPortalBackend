const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const JobappliedSchema = new Schema({
    jobs: {
            job_id: {
                required: true,
                type: ObjectId,
                ref: "Jobs"
            },
            status: {
                type: String,
                enum: ["applied", "accepted", "rejected"],
                default: "applied"

            },
    },
    created_by: {
        type: ObjectId,
        ref: "User"
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model("Jobapplied", JobappliedSchema)
