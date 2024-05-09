const asyncWraper = require("../middleware/asyncWraper");
const User = require("../models/user.model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");
const pet=require("./pets.controller.js");
//////////////////////////////////////////////////////////////////


const getAllUsers = asyncWraper(async (req, res) => {
  console.log(req.headers);
  const query = req.query;
  console.log("qeury", query);
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  console.log(users);
  res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWraper(async (req, res, next) => {
  // console.log(req.body);
  const { name, email, password, role } = req.body;
  // console.log('request->file',req.file)

  const oldUser = await User.findOne({ email: email });
// console.log('req.file',req.file)
  if (oldUser) {
    const error = appError.create(
      "user already existes",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  //hashing password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });

  //generate jwt token
  const token = await generateJWT({ email: newUser.email, id: newUser._id ,role:newUser.role });
  newUser.token = token;

  await newUser.save();
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const login = asyncWraper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    const error = appError.create(
      "email and password are required",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = appError.create("user not found", 400, httpStatusText.FAIL);
    return next(error);
  }
  const matchedPassword = await bcrypt.compare(password, user.password);

  if (user && matchedPassword) {
    //logedin successfully
    const token = await generateJWT({ email: user.email, id: user._id ,role: user.role});

    return res.json({
      status: httpStatusText.SUCCESS,
      data: { token },
    });
  } else {
    const error = appError.create("something error", 500, httpStatusText.ERROR);
    return next(error);
  }
});
// ////////////////////////////////////
// const editUser =
//   async (req, res) => {
    //  try{
    //   const iduser = req.body.id;
    //   const updatedUser = await User.updateOne(
    //     { _id: iduser },
    //     { $set: { ...req.body } }
    //   );
    //   console.log(updatedUser);
    //   console.log(iduser);
    //   console.log(req.body,req.params);

    //   return res.status(200).json({
    //     status: httpStatusText.SUCCESS,
    //     data: { user: updatedUser },
    //   });
    //  }catch(err){
    //   console.log(err.message);
    //  }
    // }
  //   console.log(req.body)
  //   return res.send("server is on")
  // }

  const editUser = asyncWraper(async (req, res,next) => {
    const userId = req.params.userId;    
    const updatedUser = await User.updateOne({_id: userId}, {$set: {...req.body}});
    console.log(req )
    return res.status(200).json({status: httpStatusText.SUCCESS, data: {user: updatedUser}})

})


module.exports = { getAllUsers, register, login, editUser };
