const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

const User = require("../model/user")
const Recruiter = require('../model/recruiter');
const Applicant = require('../model/applicant');

const login = async (req, res, next) => {
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            if (req.body.role === user.role) {
                let user_pass_obj = await User.findOne({ email: req.body.email }).select("password")
                let match_status = await bcrypt.compare(req.body.password, user_pass_obj.password);
                if (match_status) {
                    let token = jwt.sign(user.toObject(), 'shhhhh');
                    return res.send({
                        token: token
                    })
                }
                else{
                    return res.status(401).send({
                        msg:"Invalid Password"
                    })
                }
            }
            else{
                return res.status(401).send({
                    msg: "Invalid role"
                })
            }

        }
        return res.status(401).send({
            msg: "Invalid email"
        })
    } catch (err) {
        next(err);
    }
}

const signup = async (req, res, next) => {

    const users = await User.find();
    let hashed_password = "";
    const data = req.body;
    const check = users.some(func);
    function func(user) {
        return ((user.email) === (req.body.email));
    }

    if (!check) {
        if (data.password) {
            hashed_password = await bcrypt.hash(data.password, 10);
        }
        let user = new User({
            email: data.email,
            password: hashed_password,
            role: data.role,
        })
        user.save().then(() => {
            const userDetails = user.role == "recruiter" ? new Recruiter({
                userId: user._id,
                name: data.name,
                email: data.email,
                password: hashed_password,
                phoneNumber: data.phoneNumber,
                company: data.company,
            })
                :
                new Applicant({
                    userId: user._id,
                    name: data.name,
                    email: data.email,
                    password: hashed_password,
                    phoneNumber: data.phoneNumber,
                    education: data.education,
                });

            userDetails.save().then(() => {
                delete user.password
                res.send(userDetails)
            })
                .catch((err) => {
                    next(err);
                })
        })
            .catch((error) => {
                next(error);
            })
    }
    else {
        res.status(409).json("duplicate email");
    }
}


const getuser = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1] || null
    if (token) {
        try {
            let user = await jwt.verify(token, 'shhhhh');
            res.send({
                data: user,
            })

        }
        catch (err) {
            next(err);
        }
    }
}

const getuserdata = async (req, res, next) => {
    let userId = req.headers.authorization?.split(" ")[1] || null;
    try {
        let user = await User.findById(userId).exec();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }


        if (user.role === "applicant") {
            let applicant = await Applicant.findOne({ userId: user._id }).exec();

            if (!applicant) {
                return res.status(404).json({ error: 'Applicant data not found' });
            }

            const userData = {
                userId: user._id,
                email: user.email,
                role: user.role,
                name: applicant.name,
                phoneNumber: applicant.phoneNumber,
                education: applicant.education,
            };
            return res.json(userData);
        }

        if (user.role === "recruiter") {
            let recruiter = await Recruiter.findOne({ userId: user._id }).exec();

            if (!recruiter) {
                return res.status(404).json({ error: 'Recruiter data not found' });
            }

            const userData = {
                userId: user._id,
                email: user.email,
                role: user.role,
                name: recruiter.name,
                phoneNumber: recruiter.phoneNumber,
                company: recruiter.company,
            };
            return res.json(userData);
        }
    } catch (err) {
        return res.status(500).json({ error: 'An error occurred while retrieving user data' });
    }
}

module.exports = {
    login,
    signup,
    getuser,
    getuserdata
}