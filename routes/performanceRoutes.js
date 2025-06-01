const express = require('express');
const { body, param } = require('express-validator');
const ctrl = require('../controllers/performanceController');
const router  = express.Router();
const Performance = require('../models/Performance');
const ensureAuth = require('../ensureAuth');

// CREATE 
router.post(
  '/', 
  ensureAuth,
  [
    // 1) “group” must exist and be a valid MongoID
    body('group')
      .exists({ checkNull: true }).withMessage('Group ID is required')
      .bail()
      .isMongoId().withMessage('Group must be a valid MongoDB ObjectId'),

    // 2) “date” must exist and be ISO 8601
    body('date')
      .exists({ checkNull: true }).withMessage('Date is required')
      .bail()
      .isISO8601().withMessage('Date must be in ISO 8601 format (e.g. 2025-06-01T20:00:00Z)'),

    // 3) “venue” must exist, be a non-empty string
    body('venue')
      .exists({ checkNull: true }).withMessage('Venue is required')
      .bail()
      .isString().withMessage('Venue must be a string')
      .bail()
      .notEmpty().withMessage('Venue cannot be empty'),

    // 4) “ticketsSold” must exist and be an integer ≥ 0
    body('ticketsSold')
      .exists({ checkNull: true }).withMessage('TicketsSold is required')
      .bail()
      .isInt({ min: 0 }).withMessage('TicketsSold must be an integer ≥ 0'),

    // 5) “revenue” must exist and be a float ≥ 0
    body('revenue')
      .exists({ checkNull: true }).withMessage('Revenue is required')
      .bail()
      .isFloat({ min: 0 }).withMessage('Revenue must be a number ≥ 0')
  ],
  ctrl.createPerformance
);

// GET ALL (no validation needed)
router.get('/', ctrl.getAllPerformances);

// GET ONE BY ID
router.get(
  '/:id',
  [
    param('id', 'Invalid Performance ID format').isMongoId()
  ],
  ctrl.getPerformanceById
);

// UPDATE (PUT /api/performances/:id)
router.put(
  '/:id',
  ensureAuth,
  [
    // 1) Validate the “:id” path param
    param('id', 'Invalid Performance ID format').isMongoId(),

    // 2) If “group” is present, it must be a valid MongoID
    body('group')
      .optional()
      .isMongoId().withMessage('Group must be a valid MongoDB ObjectId'),

    // 3) If “date” is present, it must be ISO 8601 format
    body('date')
      .optional()
      .isISO8601().withMessage('Date must be in ISO 8601 format'),

    // 4) If “venue” is present, it must be a non-empty string
    body('venue')
      .optional()
      .isString().withMessage('Venue must be a string')
      .bail()
      .notEmpty().withMessage('Venue cannot be empty'),

    // 5) If “ticketsSold” is present, it must be an integer ≥ 0
    body('ticketsSold')
      .optional()
      .isInt({ min: 0 }).withMessage('TicketsSold must be an integer ≥ 0'),

    // 6) If “revenue” is present, it must be a number ≥ 0
    body('revenue')
      .optional()
      .isFloat({ min: 0 }).withMessage('Revenue must be a number ≥ 0')
  ],
  ctrl.updatePerformance
);

// DELETE (no additional body validation needed)
router.delete(
  '/:id',
  ensureAuth,
  [
    param('id', 'Invalid Performance ID format').isMongoId()
  ],
  ctrl.deletePerformance
);

module.exports = router;