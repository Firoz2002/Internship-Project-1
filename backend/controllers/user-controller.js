const jwt = require('jsonwebtoken');
const { Types, isValidObjectId } = require('mongoose');
const User = require("../models/user");

require('dotenv').config();
const jwtSecret = process.env.SECRET;

const createUser = (req, res, next) => {
    const {username, email, password, userType, phoneNo} = req.body;
    const skillsToTeach = [];
    const skillsToLearn = [];

    try {
        User.findOne({
            $or: [
                {username: username}, {email: email}
            ]
        })
        .then((data) => {
            if(data) {
                res.send({
                        userExist: true
                })
            } else {
                User.create({
                    username,
                    email,
                    password,
                    userType,
                    phoneNo,
                    skillsToLearn,
                    skillsToTeach,
                })
                .then((data) => {
                    res.send(data);
                })
            }
        })
        
    } catch (err) {
        console.error(err);

        res.status(401).json({
            message: "Some error occured",
            error: err
        })
    }
}

const getUser = (req, res, next) => {

    const userCredentials = req.query.userCredentials;

    try {
        User.findOne({
            '$or': [{
                _id: isValidObjectId(userCredentials) ? new Types.ObjectId(userCredentials) : null
            },{
                email: userCredentials
            },{
                username: userCredentials
            }]
        })
        .then((data) => {
            if(data) {
                res.send(data);
            } else {
                res.send({
                    userExist: false
                })
            }
        })

    } catch (err) {
        console.error(err);

        res.status(401).json({
            message: "Some error occured",
            error: err
        })
    }
}

const findUser = (req, res, next) => {

    const username = req.query.username;

    try {
        User.findOne({
           username
        })
        .then((data) => {
            if(data) {
                res.status(201).json({
                    userExist: true,
                    username: data.username,
                    message: "Successfully fetched user",
                })
            } else {
                res.status(403).json({
                    userExist: false,
                    message: "User does not exist"
                })
            }
        })

    } catch (err) {
        console.error(err);

        res.status(401).json({
            message: "Some error occured",
            error: err
        })
    }
}

const isAvaliable = (req, res, next) => {
    try {
        
    } catch (err) {
        console.error(err);

        res.status(401).json({
            message: "Some error occured",
            error: err
        })
    }
}

const updateUser = (req, res, next) => {

    const userID = jwt.verify(req.cookies.jwt, process.env.SECRET).id;

    try {
        User.findById(userID)
        .then((data) => {
            
            let skillSet;
            const skillType = req.body.skillType;

            if(skillType === "teach") {
                skillSet = data.skillsToTeach;
                const skills = req.body.skills;

                skills.forEach(skill => {
                    skillSet.push(skill);
                });
            } else if(skillType === "learn") {
                skillSet = data.skillsToLearn;
                const skills = req.body.skills;

                skills.forEach(skill => {
                    skillSet.push(skill);
                });
            }

            User.findByIdAndUpdate(
                { _id:  userID },
                {$set: {
                    email : req.body.email || data.email,
                    phoneNo : req.body.phoneNo || data.phoneNo,
                    password : req.body.password || data.password,
                    userType : req.body.userType || data.userType,
                    countryCode: req.body.countryCode || data.countryCode,
                    isAvaliable : req.body.isAvaliable || data.isAvaliable,
                    skillsToLearn : (req.body.skillType === 'learn') ? skillSet : data.skillSet,
                    skillsToTeach : (req.body.skillType === 'teach') ? skillSet : data.skillSet,
                }}
            )
            .then(() => {
                res.status(201).json({
                    message: "User information updated Successfully",
                });
            })
        })

    } catch (err) {
        console.error(err);

        res.status(401).json({
            message: "Some error occured",
            error: err
        })
    }
}

module.exports = {
    createUser,
    getUser,
    findUser,
    updateUser,
}