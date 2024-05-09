const Pet = require("../models/pet.model");
const { validationResult } = require("express-validator");
const httpStatusText = require("../utils/httpStatusText");
const asyncWraper = require("../middleware/asyncWraper");
const appError = require("../utils/appError");
//==============================================================================
const getAllPets =asyncWraper(
  async (req, res) => {
    const query = req.query;
    console.log("qeury", query);
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const pets = await Pet.find({}, { __v: false }).limit(limit).skip(skip);
    console.log(pets);
    res.json({ status: httpStatusText.SUCCESS, data: { pets } });
  }
)

//==============================
const getSinglePet = asyncWraper(
    async (req, res,next) => {

        const pet = await Pet.findById(req.params.idpet);
        if (!pet) {
         const error= appError.create('Not Found pet',404,httpStatusText.FAIL);
            return next (error);       
        }
        return res.json({ status: httpStatusText.SUCCESS, data: { pet } });
         } );
//==============================
const addPet =asyncWraper(async (req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    const error=appError.create(errors.array(),400,httpStatusText.FAIL)
    return next(error);
    }
    const newPet = new Pet(req.body);
    await newPet.save();
    res
      .status(201)
      .json({ status: httpStatusText.SUCCESS, data: { pet: newPet } });
  }) 
//==============================
const editPet =asyncWraper(
    async (req, res) => {
        const idpet = req.params.idpet;
          const updatedPet = await Pet.updateOne(
            { _id: idpet },
            { $set: { ...req.body } }
          );
          return res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: { pet: updatedPet },
          });
      }
) 
//==============================
const deletePet =asyncWraper(async (req, res) => {
      await Pet.deleteOne({ _id: req.params.idpet });
      res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
  }) 
//==============================

module.exports = {
  getAllPets,
  getSinglePet,
  addPet,
  editPet,
  deletePet,
};
