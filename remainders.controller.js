const Remainder = require("../models/remainder.model");
const { validationResult } = require("express-validator");
const httpStatusText = require("../utils/httpStatusText");
const asyncWraper = require("../middleware/asyncWraper");
const appError = require("../utils/appError");
const moment = require("moment");
//==============================================================================
const getAllRemainders = asyncWraper(async (req, res) => {
  const query = req.query;
  console.log("qeury", query);
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const remainders = await Remainder.find({}, { __v: false })
    .limit(limit)
    .skip(skip);
  console.log(remainders);
  res.json({ status: httpStatusText.SUCCESS, data: { remainders } });
});

//==============================
const getSingleRemainder = asyncWraper(async (req, res, next) => {
  const remainder = await Remainder.findById(req.params.idremainder);
  if (!remainder) {
    const error = appError.create("Not Found pet", 404, httpStatusText.FAIL);
    return next(error);
  }
  return res.json({ status: httpStatusText.SUCCESS, data: { remainder } });
});
//==============================
// const addRemainder = asyncWraper(async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
//     return next(error);
//   }
//   const newRemainder = new Remainder(req.body);
//   await newRemainder.save();
//   // await schedule.createSchedule(newRemainder);
//   res
//     .status(201)
//     .json({
//       status: httpStatusText.SUCCESS,
//       data: { remainder: newRemainder },
//     });
// });
const addRemainder =asyncWraper(async (req, res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  const error=appError.create(errors.array(),400,httpStatusText.FAIL)
  return next(error);
  }
  const newReminder = new Remainder(req.body);
  await newReminder.save();
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { remainder: newReminder } });
}) 

//////////////////////////////////

//==============================
const editRemainder = asyncWraper(async (req, res) => {
  const idremainder = req.params.idremainder;
  const updatedRemainder = await Remainder.updateOne(
    { _id: idremainder },
    { $set: { ...req.body } }
  );
  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { remainder: updatedRemainder },
  });
});
//==============================
const deleteRemainder = asyncWraper(async (req, res) => {
  await Remainder.deleteOne({ _id: req.params.idremainder });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});
//==============================

module.exports = {
  getAllRemainders,
  getSingleRemainder,
  addRemainder,
  editRemainder,
  deleteRemainder,
};
