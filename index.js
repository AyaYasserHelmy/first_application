const express = require("express");
const cors = require("cors");
const app = express();
const moment = require("moment");
app.use(express.json());

const path=require("path");
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

const mongoose = require("mongoose");

require("dotenv").config();
const httpStatusText = require("./utils/httpStatusText");
const appError = require("./utils/appError");

app.use(cors());

console.log("==================", process.env.MONGO_URL);
const url = process.env.MONGO_URL;
mongoose.connect(url).then(() => {
  console.log("mongodb server start");
});
//pet router****
const petRouter = require("./routes/pets.route");
app.use("/api/pets", petRouter);
//user router****
const userRouter = require("./routes/users.route");
app.use("/api/users", userRouter);
//remainder router****
const remainderRouter = require("./routes/remainder.route");
app.use("/api/remainders", remainderRouter);

//port
app.listen(process.env.PORT || 4000, () => {
  console.log("listening on port 5000");
});

//global middleware for not found routes
app.all("*", (req, res, next) => {
  return res
    .status(404)
    .json({
      status: httpStatusText.ERROR,
      message: "resource is not available",
    });
});

//global error handler
app.use((error, req, res, next) => {
  res
    .status(error.statusCode || 500)
    .json({
      status: error.statusText|| httpStatusText.ERROR,
      message: error.message,
      code: error.statusCode || 500,
      data: null,
    });
});