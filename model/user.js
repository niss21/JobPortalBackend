const mongoose = require("mongoose")
require("mongoose-type-email");

const userSchema = new mongoose.Schema({
    
    email: {
        type: mongoose.SchemaTypes.Email,
        unique: true,
        lowercase: true,
        required: true,
      },
    password: {
        type: String,
        minLength: 8,
        required: true,
        select: false,
    },
    role: {
        required: true,
        type: String,
        enum: ["recruiter", "applicant"]
    }

},
{ collation: { locale: "en" } }
);


const User = mongoose.model('User', userSchema);

module.exports = User;

