const mongoose = require("mongoose");

const { Schema } = mongoose;  

const regScheme = new Schema({
  login: String,
  password: String,
});

module.exports = User = mongoose.model("registration", regScheme);