// routes/groupRoutes.js
const express         = require('express');
const { body, param }   = require('express-validator');
const router            = express.Router();
const ctrl              = require('../controllers/groupController');
const ensureAuth        = require('../ensureAuth');

// Create
const createValidators = [
  // 1) “name” must be a non-empty string
  body('name')
    .isString()
    .notEmpty()
    .withMessage('Name is required and must be a non-empty string'),

  // 2) “members” must exist
  body('members')
    .exists({ checkNull: true }).withMessage('Members is required')
    .bail(),

  // 3) “members” must actually be an array
  body('members')
    .isArray().withMessage('Members must be an array')
    .bail(),

  // 4) “members” array must have at least one entry
  body('members')
    .custom(arr => Array.isArray(arr) && arr.length >= 1)
    .withMessage('Members array must contain at least one member')
    .bail(),

  // 5) “genre” must be a non-empty string
  body('genre')
    .isString()
    .notEmpty()
    .withMessage('Genre is required and must be a non-empty string'),

  // 6) “costToPerform” must parse as a non-negative number
  body('costToPerform')
    .custom(value => {
      return !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
    })
    .withMessage('Cost must be a number ≥ 0')
];

// For debugging
console.log('🛡️  createValidators =', createValidators);

router.post(
  '/',
  ensureAuth,
  createValidators,
  ctrl.createGroup
);

// GET all
router.get('/', ctrl.getAllGroups);

// GET one
router.get(
  '/:id',
  [
    param('id', 'Invalid Group ID format').isMongoId()
  ],
  ctrl.getGroupById
);

// Update
router.put(
  '/:id',
  ensureAuth,
  [
    param('id', 'Invalid Group ID format').isMongoId(),

    body('costToPerform')
      .optional()
      .custom(value => {
        return !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
      })
      .withMessage('Cost must be a number ≥ 0')
  ],
  ctrl.updateGroup
);

// Delete
router.delete(
  '/:id',
  ensureAuth,
  [
    param('id', 'Invalid Group ID format').isMongoId()
  ],
  ctrl.deleteGroup
);

module.exports = router;
