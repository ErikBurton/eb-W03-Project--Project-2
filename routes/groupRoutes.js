const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const ctrl = require('../controllers/groupController');

// Create
router.post(
  '/',
  [
    body('name').isString().notEmpty(),
    body('members').isArray({ min: 1 }),
    body('genre').isString().notEmpty(),
    body('costToPerform').isFloat({ min: 0 }),
  ],
  ctrl.createGroup
);

// GET all
router.get('/', ctrl.getAllGroups);

// GET one
router.get(
  '/:id',
  [ param('id').isMongoId() ],
  ctrl.getGroupById
);

// Update
router.put(
  '/:id',
  [
    param('id').isMongoId(),
    body('costToPerform').optional().isFloat({ min: 0 }),
  ],
  ctrl.updateGroup
);

// Delete
router.delete(
  '/:id',
  [ param('id').isMongoId() ],
  ctrl.deleteGroup
);

module.exports = router;
