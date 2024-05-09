const mongoose = require("mongoose");
const petSchema = new mongoose.Schema({
    petname:{
        type: 'string',
        required: true,
    },
    breed:{
        type: 'string',
        required: true,
    },
    dateOfBearth:{
        type: 'string',
        required: true,
    },
    age:{
        type: 'string',
        required: true,
    },
    gender:{
        type: 'string',
        required: true,
    },
    weight:{
        type: 'string',
        required: true,
    }
});

module.exports = mongoose.model("Pet", petSchema);
