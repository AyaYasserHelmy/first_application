const mongoose = require("mongoose");
const validator = require("validator");
const userRoles = require("../utils/userRoles");

const userSchema = new mongoose.Schema({
  
  name: {
      required: true,
      type:String,
    },
  email: {
    required: true,
    type:String,
    unique: true,
    validate: [validator.isEmail, "Filed must be a valid email address"],
  },
  password: {
    required: true,
    type:String,
  },
  token:{
    type:String,
  },
  role:{
    type:String, //[admin,user, manager]
    enum: [userRoles.USER,userRoles.MANAGER, userRoles.ADMIN],
    default:userRoles.USER,
  },
  avatar:{
    type:String,
    default:'uploads/profile.webp', 
  },
});

module.exports = mongoose.model("User", userSchema);
