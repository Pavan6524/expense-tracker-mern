import express from 'express';
import cors from 'cors';
import expenseRoutes from './routes/expenses.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));
app.get('/api/health', (req, res) => res.json({ success: true, data: { status: 'ok' } }));
app.use('/api/expenses', expenseRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
