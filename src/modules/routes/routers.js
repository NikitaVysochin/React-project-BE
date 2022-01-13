const express = require("express");
const router = express.Router();

const {
  createNewUsers,
  getUser,
} = require('../controllers/user.controllers');

router.post('/createUser', createNewUsers);
router.post('/getUser', getUser);

module.exports = router;