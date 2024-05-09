const express = require('express');
const router=express.Router();
const petsController = require('../controllers/pets.controller');
const {body} = require('express-validator');
const {validationSchema}=require('../middleware/middlewareSchema');
const verifyToken = require('../middleware/verifyToken');
const userRoles = require('../utils/userRoles');
const allowedTo=require('../middleware/allowedTo');
router.route('/')
    .get(verifyToken,petsController.getAllPets)
    .post(validationSchema(),petsController.addPet)


router.route('/:idpet')
    .get(petsController.getSinglePet)
    .delete(verifyToken,petsController.deletePet)
    .patch(verifyToken,petsController.editPet);

module.exports = router;