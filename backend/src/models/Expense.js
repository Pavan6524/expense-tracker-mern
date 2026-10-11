import mongoose from 'mongoose';

export const CATEGORIES = ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Health', 'Travel', 'Other'];

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true, maxlength: 120 },
  amount: { type: Number, required: true, min: 0.01 },
  category: { type: String, required: true, enum: CATEGORIES },
  date: { type: Date, required: true, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
