const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

/* GET all users */
router.get('/', userController.getAllUsers);

module.exports = router;