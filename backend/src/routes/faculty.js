const express = require('express');
const router = express.Router();
const facultyCtrl = require('../controllers/facultyController');

// public endpoints for now
router.get('/', facultyCtrl.getAll);
router.post('/', facultyCtrl.create);
router.put('/:id', facultyCtrl.update);
router.delete('/:id', facultyCtrl.delete);

module.exports = router;
