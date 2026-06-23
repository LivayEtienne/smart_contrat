'use strict';
const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const { getStats } = require('../controllers/adminController');

router.get('/stats', auth('admin'), getStats);

module.exports = router;
