const express = require('express');
const router = express.Router();
const feedbackCtrl = require('../controllers/feedbackController');

router.get('/', feedbackCtrl.getAll);
router.post('/', feedbackCtrl.create);

module.exports = router;
