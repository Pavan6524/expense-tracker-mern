import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const port = Number(process.env.PORT) || 5000;
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Missing MONGODB_URI. Copy backend/.env.example to backend/.env and configure your MongoDB Atlas URI.');
  process.exit(1);
}

try {
  await mongoose.connect(uri, { dbName: 'expense_tracker' });
  app.listen(port, () => console.log(`Expense Tracker API listening on port ${port}`));
} catch (error) {
  console.error('Could not connect to MongoDB:', error.message);
  process.exit(1);
}
