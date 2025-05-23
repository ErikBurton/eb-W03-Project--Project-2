const { validationResult } = require('express-validator');
const Performance = require('../models/Performance');

function checkValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}

// CREATE
exports.createPerformance = async (req, res, next) => {
  if (checkValidation(req, res)) return;
  try {
    const perf = await Performance.create(req.body);
    res.status(201).json(perf);
  } catch (err) {
    next(err);
  }
};

// GET ALL
exports.getAllPerformances = async (req, res, next) => {
  try {
    const list = await Performance.find().lean();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

// GET ONE
exports.getPerformanceById = async (req, res, next) => {
  if (checkValidation(req, res)) return;
  try {
    const perf = await Performance.findById(req.params.id).lean();
    if (!perf) return res.status(404).json({ error: 'Not found' });
    res.json(perf);
  } catch (err) {
    next(err);
  }
};

// UPDATE
exports.updatePerformance = async (req, res, next) => {
  if (checkValidation(req, res)) return;
  try {
    const updated = await Performance.findByIdAndUpdate(
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
exports.deletePerformance = async (req, res, next) => {
  if (checkValidation(req, res)) return;
  try {
    const deleted = await Performance.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};