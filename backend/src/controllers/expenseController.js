import mongoose from 'mongoose';
import Expense, { CATEGORIES } from '../models/Expense.js';

function validatePayload(body, partial = false) {
  const allowed = ['description', 'amount', 'category', 'date'];
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Request body must be a JSON object.';
  if (Object.keys(body).some((key) => !allowed.includes(key))) return 'Only description, amount, category, and date are accepted.';
  if (!partial || 'description' in body) {
    if (typeof body.description !== 'string' || !body.description.trim() || body.description.trim().length > 120) return 'Description must be between 1 and 120 characters.';
  }
  if (!partial || 'amount' in body) {
    if (typeof body.amount !== 'number' || !Number.isFinite(body.amount) || body.amount <= 0) return 'Amount must be a number greater than zero.';
  }
  if (!partial || 'category' in body) {
    if (!CATEGORIES.includes(body.category)) return `Category must be one of: ${CATEGORIES.join(', ')}.`;
  }
  if ('date' in body && Number.isNaN(new Date(body.date).getTime())) return 'Date must be a valid date.';
  return null;
}

function fail(res, status, message) {
  return res.status(status).json({ success: false, error: { message } });
}

export async function listExpenses(req, res) {
  const filter = {};
  if (req.query.category) {
    if (!CATEGORIES.includes(req.query.category)) return fail(res, 400, 'Unknown expense category.');
    filter.category = req.query.category;
  }
  if (req.query.search) filter.description = { $regex: req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });
  res.json({ success: true, data: expenses });
}

export async function createExpense(req, res) {
  const invalid = validatePayload(req.body);
  if (invalid) return fail(res, 400, invalid);
  const expense = await Expense.create({ ...req.body, description: req.body.description.trim() });
  res.status(201).json({ success: true, data: expense });
}

export async function updateExpense(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 400, 'Invalid expense ID.');
  const invalid = validatePayload(req.body, true);
  if (invalid) return fail(res, 400, invalid);
  const body = { ...req.body };
  if (body.description) body.description = body.description.trim();
  const expense = await Expense.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
  if (!expense) return fail(res, 404, 'Expense not found.');
  res.json({ success: true, data: expense });
}

export async function deleteExpense(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 400, 'Invalid expense ID.');
  const expense = await Expense.findByIdAndDelete(req.params.id);
  if (!expense) return fail(res, 404, 'Expense not found.');
  res.json({ success: true, data: { id: expense.id } });
}

export async function getSummary(req, res) {
  const result = await Expense.aggregate([
    { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } }
  ]);
  const total = result.reduce((sum, item) => sum + item.total, 0);
  res.json({ success: true, data: { total, count: result.reduce((sum, item) => sum + item.count, 0), categories: result } });
}
