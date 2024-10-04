const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
      min: 3,
      max: 30,
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      require: true
    },
    countryCode: {
      type: String,
      default: "+91"
    },
    phoneNo: {
      type: Number
    },
    userType: {
      type: String,
      enum: ["student", "mentor", "both"],
      default: "student"
    },
    skillsToTeach: [],
    skillsToLearn: [],
    isAvaliable: {
      type: Boolean,
      default: false
    }
    
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;
