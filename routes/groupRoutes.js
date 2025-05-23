const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const ctrl = require('../controllers/groupController');

// Create
// Datavalidation: express-validator checks on the incoming body fields.
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
// No validation needed for listing all
router.get('/', ctrl.getAllGroups);

// GET one
// Datavalidation: id must be a valid MongoDB OjbectID
router.get(
  '/:id',
  [ param('id').isMongoId() ],
  ctrl.getGroupById
);

// Update
// Data Validation: id must be valid and optional body fields must follow their rules
router.put(
  '/:id',
  [
    param('id').isMongoId(),
    body('costToPerform').optional().isFloat({ min: 0 }),
  ],
  ctrl.updateGroup
);

// Delete
// Data Validation: ensure id is well‐formed
router.delete(
  '/:id',
  [ param('id').isMongoId() ],
  ctrl.deleteGroup
);

module.exports = router;
