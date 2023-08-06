
const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
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
  
  education: {
    type: String,
    required: true
  },
  
}, { timestamps: true },
{ collation: { locale: "en" } }
);

const Applicant = mongoose.model('Applicant', applicantSchema);

module.exports = Applicant;

