
const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
}, { timestamps: true },
{ collation: { locale: "en" } }
);

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

module.exports = Recruiter;
