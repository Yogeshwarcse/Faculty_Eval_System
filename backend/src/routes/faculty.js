const express = require('express');
const router = express.Router();
const facultyCtrl = require('../controllers/facultyController');
const authMiddleware = require('../middleware/auth');

// Faculty self-service: get own performance metrics (auth required, faculty only)
router.get('/me/metrics', authMiddleware, facultyCtrl.getMyMetrics);

// Admin/public endpoints
router.get('/', facultyCtrl.getAll);
router.get('/:id', facultyCtrl.getById);
router.post('/', facultyCtrl.create);
router.put('/:id', facultyCtrl.update);
router.delete('/:id', facultyCtrl.delete);

module.exports = router;
