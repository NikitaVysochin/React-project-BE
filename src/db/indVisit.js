const mongoose = require("mongoose");
const { Schema } = mongoose;  
const regScheme = new Schema({
  name: String,
  doctor: String,
  date: Date,
  complaint: String,
  id_user: String
});

module.exports = Visit = mongoose.model("visit", regScheme);