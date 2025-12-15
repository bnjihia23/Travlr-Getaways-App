const express = require('express');
const router  = express.Router();
const ctrlMain = require('../controllers/main');

// site root (home)
router.get('/', ctrlMain.index);

module.exports = router;
