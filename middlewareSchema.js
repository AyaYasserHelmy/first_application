const {body} = require('express-validator');

const validationSchema=()=>{
    return[
    body('petname').notEmpty().isLength({min:2}),
    body('breed').notEmpty(),
    body('dateOfBearth').notEmpty(),
    body('age').notEmpty(),
    body('gender').notEmpty(),
    body('weight').notEmpty(),

]};
module.exports={validationSchema};