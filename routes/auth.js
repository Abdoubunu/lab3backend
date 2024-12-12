const express = require('express');
const { verifyWallet } = require('../controllers/authController');
const router = express.Router();

router.post('/verify', verifyWallet);

module.exports = router;
