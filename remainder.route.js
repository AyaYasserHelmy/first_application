const express = require("express");
const router = express.Router();
const RemaindersController = require("../controllers/remainders.controller");
const { body } = require("express-validator");
const { validationSchema } = require("../middleware/middlewareSchema");
const verifyToken = require("../middleware/verifyToken");
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middleware/allowedTo");
const moment = require("moment");


// Defining routes for 'remainders' resource
router
  .route("/")
  // Route to get all remainders
  .get(verifyToken, RemaindersController.getAllRemainders)
  // Route to add a new remainder
  .post(RemaindersController.addRemainder);

router
  .route("/:idremainder")
  // Route to get a single remainder by ID
  .get(RemaindersController.getSingleRemainder)
  // Route to delete a remainder by ID
  .delete(
    verifyToken,
    allowedTo(userRoles.USER),
    RemaindersController.deleteRemainder
  )
  // Route to edit a remainder by ID
  .patch(
    verifyToken,
    allowedTo(userRoles.USER),
    RemaindersController.editRemainder
  );
// 
// Exporting the router
module.exports = router;
