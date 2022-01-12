const mongoose = require("mongoose");
const { Schema } = mongoose;  
const regScheme = new Schema({
  login: {type: String, unique: true},
  password: String,
});

module.exports = User = mongoose.model("registration", regScheme);