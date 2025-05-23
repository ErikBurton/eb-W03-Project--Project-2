const { validationResult } = require('express-validator');
const Group = require('../models/Group');

// helper to send 400 on validation errors
function checkValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}

exports.createGroup = async (req, res, next) => {
  if (checkValidation(req, res)) return;
  try {
    const grp = await Group.create(req.body);
    res.status(201).json(grp);
  } catch (err) {
    next(err);
  }
};

exports.getAllGroups = async (req, res, next) => {
  try {
    const list = await Group.find().lean();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.getGroupById = async (req, res, next) => {
  if (checkValidation(req, res)) return;
  try {
    const grp = await Group.findById(req.params.id).lean();
    if (!grp) return res.status(404).json({ error: 'Not found' });
    res.json(grp);
  } catch (err) {
    next(err);
  }
};

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
