const express = require("express");
const router = express.Router();

const {
  createNewUsers,
} = require('../controllers/user.controllers');

router.post('/createUser', createNewUsers);

module.exports = router;