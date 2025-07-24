const express = require('express');
const UserAuth = require('../middleware/userAuth');
const { getUserProfile } = require('../controllers/auth/userController');

const router = express.Router();

router.get("/data", UserAuth, getUserProfile);

module.exports = router;