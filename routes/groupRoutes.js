const express       = require('express');
const { body, param } = require('express-validator');
const router        = express.Router();
const ctrl          = require('../controllers/groupController');
const ensureAuth    = require('../ensureAuth');

// Create
router.post(
  '/',
  ensureAuth,
  [
    body('name')
      .isString()
      .notEmpty()
      .withMessage('Name is required and must be a non-empty string'),

    body('members')
      .isArray()
      .withMessage('Members must be an array')
      .bail()
      .custom(arr => Array.isArray(arr) && arr.length >= 1)
      .withMessage('Members array must contain at least one member'),

    body('genre')
      .isString()
      .notEmpty()
      .withMessage('Genre is required and must be a non-empty string'),

   body('costToPerform')
      .custom(value => {
        return !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
      })
      .withMessage('Cost must be a number ≥ 0')
      ],
  ctrl.createGroup
);

// GET all
router.get('/', ctrl.getAllGroups);

// GET one
router.get(
  '/:id',
  [
    param('id', 'Invalid Group ID format')
      .isMongoId()
  ],
  ctrl.getGroupById
);

// Update
router.put(
  '/:id',
  ensureAuth,
  [
    param('id', 'Invalid Group ID format')
      .isMongoId(),

    body('costToPerform')
      .optional()
      .custom(value => {
        return !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
      })
      .withMessage('Cost must be a number ≥ 0')
      .bail(),

    body('costToPerform')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Cost must be an integer ≥ 0')
  ],
  ctrl.updateGroup
);

// Delete
router.delete(
  '/:id',
  ensureAuth,
  [
    param('id', 'Invalid Group ID format')
      .isMongoId()
  ],
  ctrl.deleteGroup
);

module.exports = router;
