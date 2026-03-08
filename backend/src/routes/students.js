const express = require('express');
const router = express.Router();
const studentCtrl = require('../controllers/studentController');

router.get('/', studentCtrl.getAll);
router.patch('/:id/block', studentCtrl.toggleBlock);

module.exports = router;
