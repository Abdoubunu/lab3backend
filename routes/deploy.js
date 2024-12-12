const express = require('express');
const router = express.Router();
const { deployProject } = require('../controllers/deployController');

// POST route to deploy a project
router.post('/deploy', deployProject);

module.exports = router;
