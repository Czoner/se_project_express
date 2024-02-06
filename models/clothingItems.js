const mongoose = require("mongoose");
const validator = require("validator");

const clothingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  weather: {
    type: String,
    required: true,
    enum: ['hot', 'warm', 'cold']
  },

  imageURL: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  }

  owner:



})

module.exports = mongoose.model("clothingItems", clothingSchema)