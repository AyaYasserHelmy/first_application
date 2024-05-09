// Importing mongoose for MongoDB interaction
const mongoose = require("mongoose");

// Defining remainder schema using mongoose Schema constructor
const remainderSchema = new mongoose.Schema({
  
  title: String,
  dueDate: Date,
  time: String,
  userId: String,
  petName: String,
  fcmToken: String,

});
const Remainder = mongoose.model('Remainder', remainderSchema);

module.exports = Remainder;