# Spendwise Expense Tracker

A small full stack expense tracker built with React, Vite, Express, and MongoDB. It includes a responsive dashboard, expense CRUD, description search, category filtering, and spending summaries.

## Requirements

- Node.js 20 or newer
- MongoDB Atlas connection string for the `expense_tracker` database

## Setup

1. Install both app and API dependencies: `npm run install:all`.
2. Copy `backend/.env.example` to `backend/.env` and replace the URI placeholders with your Atlas connection string. Keep the database name as `expense_tracker`. The `.env` file is ignored by Git.
3. Start the API and Vite development server: `npm run dev`.
4. Open `http://localhost:5173`. The Vite dev server proxies `/api` requests to the API on port 5000.

Alternatively, run `npm run dev:server` and `npm run dev:client` in separate terminals. To build the frontend, run `npm run build`. `npm start` starts the API server.

## API

- `GET /api/health` — service health
- `GET /api/expenses?search=coffee&category=Food%20%26%20Dining` — list and filter
- `POST /api/expenses` — create
- `PUT /api/expenses/:id` — update supplied fields
- `DELETE /api/expenses/:id` — delete
- `GET /api/expenses/summary` — total spending, count, and category totals

Create payload example: `{ "description": "Coffee", "amount": 4.5, "category": "Food & Dining", "date": "2026-10-11" }`. Amounts are positive numbers. Categories are Food & Dining, Transportation, Shopping, Bills & Utilities, Entertainment, Health, Travel, and Other. Responses use `{ success, data }`; errors use `{ success: false, error: { message, details? } }`.

## Tests and database isolation

Run API tests with `npm test`. By default, tests use a temporary in-memory MongoDB database named `expense_tracker_test`; they do not load `backend/.env` or read `MONGODB_URI`. If `TEST_MONGODB_URI` is deliberately configured, the test runner accepts it only when its database name contains `expense_tracker_test`. Never set that variable to a production or shared development database. `mongodb-memory-server` may need to download a MongoDB binary on its first run.

## Configuration

`backend/.env` supports `MONGODB_URI`, `PORT`, and `CLIENT_ORIGIN`. The server selects the `expense_tracker` database. Credentials are not stored in source. The app currently displays amounts in USD; update the currency formatter in `src/App.jsx` if you need another currency.
