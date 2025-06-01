const { validationResult } = require('express-validator');
const Group = require('../models/Group');

// Helper to send 400 on validation errors
function checkValidation(req, res) {
  console.log('\n>>> RAW REQUEST BODY:', JSON.stringify(req.body));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('>>> VALIDATION ERRORS:', errors.array());
    // Error Handling: respond with HTTP 400 and the array of validation errors
    return res.status(400).json({ errors: errors.array() });
  }
}

// CREATE
exports.createGroup = async (req, res, next) => {
  // Data Validation: if checkValidation sends a 400, otherwide stop here
  if (checkValidation(req, res)) return;
  try {
    const grp = await Group.create(req.body);
    res.status(201).json(grp);
  } catch (err) {
    // Error Handling: uncaught errors bubble to the global handler: HTTP 500
    next(err);
  }
};

// GET ALL
exports.getAllGroups = async (req, res, next) => {
  try {
    const list = await Group.find().lean();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

// GET ONE
exports.getGroupById = async (req, res, next) => {
  if (checkValidation(req, res)) return;
  try {
    const grp = await Group.findById(req.params.id).lean();
    if (!grp) 
      // Error Handling: not found: HTTP 404
      return res.status(404).json({ error: 'Not found' });
    res.json(grp);
  } catch (err) {
    next(err);
  }
};

// UPDATE
exports.updateGroup = async (req, res, next) => {
  if (checkValidation(req, res)) return;
  try {
    const updated = await Group.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE
exports.deleteGroup = async (req, res, next) => {
  if (checkValidation(req, res)) return;
  try {
    const deleted = await Group.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
