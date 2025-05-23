const express = require('express');
const { body, param } = require('express-validator');
const ctrl = require('../controllers/performanceController');
const router  = express.Router();
const Performance = require('../models/Performance');

// Data Validation on all required fields
router.post(
  '/',
  [
    body('group').isMongoId(),
    body('date').isISO8601(),
    body('venue').isString().notEmpty(),
    body('ticketsSold').isInt({ min: 0 }),
    body('revenue').isFloat({ min: 0 }),
  ],
  ctrl.createPerformance
);

// GET all (no validation)
router.get('/', ctrl.getAllPerformances);

// GET one by ID (validate param)
router.get(
  '/:id',
  [param('id').isMongoId()],
  ctrl.getPerformanceById
);

// Validation for optional updates
router.put(
  '/:id',
  [
    param('id').isMongoId(),
    body('group').optional().isMongoId(),
    body('date').optional().isISO8601(),
    body('venue').optional().isString(),
    body('ticketsSold').optional().isInt({ min: 0 }),
    body('revenue').optional().isFloat({ min: 0 }),
  ],
  ctrl.updatePerformance
);

router.delete(
  '/:id',
  [param('id').isMongoId()],
  ctrl.deletePerformance
);

module.exports = router;
