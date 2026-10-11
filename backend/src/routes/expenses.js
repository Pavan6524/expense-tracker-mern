import { Router } from 'express';
import { createExpense, deleteExpense, getSummary, listExpenses, updateExpense } from '../controllers/expenseController.js';

const router = Router();
router.get('/summary', getSummary);
router.route('/').get(listExpenses).post(createExpense);
router.route('/:id').put(updateExpense).delete(deleteExpense);
export default router;
