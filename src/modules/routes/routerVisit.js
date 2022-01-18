const express = require("express");
const routerVisit = express.Router();

const {
  createNewVisit,
  getAllVisits,
  deleteVisit,
  changeVisit
} = require('../controllers/user.controllers');

routerVisit.post('/createNewVisit', createNewVisit);
routerVisit.get('/getAllVisits', getAllVisits);
routerVisit.delete('/deleteVisit', deleteVisit);
routerVisit.patch('/changeVisit', changeVisit);

module.exports = routerVisit;