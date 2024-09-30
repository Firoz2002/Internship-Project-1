const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid");

const Doubt = require("../models/doubt");

const createDoubt = (req, res, next) => {

    const userID = jwt.verify(req.cookies.jwt, process.env.SECRET).id;
    const {topic, doubt, method} = req.body;

    try {
        Doubt.create({
            userID,
            topic,
            doubt,
            method,
        })
        .then((data) => {
            res.status(201).json({
                message: "Doubt successfully created",
                info: data
            });
        })        
    } catch (err) {
        console.error(err);

        res.status(401).json({
            message: "Some error occured",
            error: err
        });
    }
}

const acceptDoubt = (req, res, next) => {

    const { doubtID } = req.body;

    try {
        Doubt.updateOne(
            { _id: doubtID },
            { $set: {status: "accepted"}}
        )
        .then((data) => {
            data.push({roomID : `${uuidv4()}`});
            res.status(201).json({
                message: "Doubt successfully accepted",
                data: data
            });
        })        
    } catch (err) {
        console.error(err);

        res.status(401).json({
            message: "Some error occured",
            error: err
        });
    }
}

module.exports = {
    createDoubt,
    acceptDoubt,
}