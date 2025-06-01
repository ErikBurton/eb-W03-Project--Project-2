console.log('🎬 groupRoutes.js loaded');
const express         = require('express');
const { body, param }   = require('express-validator');
const router            = express.Router();
const ctrl              = require('../controllers/groupController');
const ensureAuth        = require('../ensureAuth');

// Create
router.post(
  '/',
  ensureAuth,
  [
    // 1) “name” must exist, be a string, and not be empty
    body('name')
      .exists({ checkNull: true }).withMessage('Name is required')
      .bail()
      .isString().withMessage('Name must be a string')
      .bail()
      .notEmpty().withMessage('Name cannot be empty'),

    // 2) “members” must exist
    body('members')
      .exists({ checkNull: true }).withMessage('Members is required')
      .bail(),

    // 3) “members” must be an array
    body('members')
      .isArray().withMessage('Members must be an array')
      .bail(),

    // 4) “members” array must have at least one element
    body('members')
      .custom(arr => Array.isArray(arr) && arr.length >= 1)
      .withMessage('Members array must contain at least one member')
      .bail(),

    // 5) “genre” must exist, be a string, and not be empty
    body('genre')
      .exists({ checkNull: true }).withMessage('Genre is required')
      .bail()
      .isString().withMessage('Genre must be a string')
      .bail()
      .notEmpty().withMessage('Genre cannot be empty'),

    // 6) “costToPerform” must exist and parse as a non‐negative number
    body('costToPerform')
      .exists({ checkNull: true }).withMessage('CostToPerform is required')
      .bail()
      .custom(value => !isNaN(parseFloat(value)) && parseFloat(value) >= 0)
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
    param('id', 'Invalid Group ID format').isMongoId()
  ],
  ctrl.getGroupById
);

// Update
router.put(
  '/:id',
  ensureAuth,
  [
    // 1) Always validate the :id path param
    param('id', 'Invalid Group ID format').isMongoId(),

    // 2) If “name” is provided, it must be a non-empty string
    body('name')
      .optional()
      .isString().withMessage('Name must be a string')
      .bail()
      .notEmpty().withMessage('Name cannot be empty'),

    // 3) If “members” is provided, it must be a non-empty array of strings
    body('members')
      .optional()
      .isArray().withMessage('Members must be an array')
      .bail()
      .custom(arr => Array.isArray(arr) && arr.length >= 1)
      .withMessage('Members array must contain at least one member'),

    // 4) If “genre” is provided, it must be a non-empty string
    body('genre')
      .optional()
      .isString().withMessage('Genre must be a string')
      .bail()
      .notEmpty().withMessage('Genre cannot be empty'),

    // 5) If “costToPerform” is provided, it must be a number ≥ 0
    body('costToPerform')
      .optional()
      .custom(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0)
      .withMessage('Cost must be a number ≥ 0'),

    // 6) If “originCity” is provided, it must be a string (empty string allowed)
    body('originCity')
      .optional()
      .isString().withMessage('OriginCity must be a string'),

    // 7) If “activeSince” is provided, it must be a valid ISO date
    body('activeSince')
      .optional()
      .isISO8601().withMessage('activeSince must be a valid ISO date (YYYY-MM-DD)'),

    // 8) If “website” is provided, it must be a valid URL
    body('website')
      .optional()
      .isURL().withMessage('Website must be a valid URL'),

    // 9) If “albumsReleased” is provided, it must be an integer ≥ 0
    body('albumsReleased')
      .optional()
      .isInt({ min: 0 }).withMessage('AlbumsReleased must be an integer ≥ 0')
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
