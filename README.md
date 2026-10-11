# Spendwise Expense Tracker

A full-stack MERN application for tracking and managing personal expenses. Spendwise provides a responsive dashboard where users can add, view, edit, and delete expenses, search descriptions, filter by category, and review spending summaries.

## Key Features

- **Expense Management:** Create, view, update, and delete expenses.
- **Dashboard:** View total spending, expense counts, and category-wise summaries.
- **Search and Filtering:** Search expenses by description and filter by category.
- **Data Persistence:** Store expense records in MongoDB.
- **Input Validation:** Validate expense data and return clear API error responses.
- **Responsive UI:** Use the application on different screen sizes.
- **User Feedback:** Display loading, empty, success, and error states.
- **API Testing:** Test expense operations using an isolated test database.

## Technologies Used

- **Frontend:** React.js, Vite, JavaScript, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **API:** RESTful APIs
- **Testing:** Node.js test runner, Supertest, mongodb-memory-server
- **Development Tools:** Git, GitHub, Postman (if used), AI-assisted development tools

## Requirements

- Node.js 20 or newer
- npm
- MongoDB Atlas connection string for the `expense_tracker` database

## Setup and Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Pavan6524/expense-tracker-mern.git
   cd expense-tracker-mern
   ```

2. Install frontend and backend dependencies:

   ```bash
   npm run install:all
   ```

3. Create the backend environment file by copying the example:

   **Windows PowerShell:**

   ```powershell
   Copy-Item backend/.env.example backend/.env
   ```

   **macOS/Linux:**

   ```bash
   cp backend/.env.example backend/.env
   ```

4. Open `backend/.env` and replace the MongoDB URI placeholders with your MongoDB Atlas connection string. Use the `expense_tracker` database and configure the required environment variables.

   Example configuration:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   CLIENT_ORIGIN=http://localhost:5173
   ```

   Replace the example URI with your actual connection string. Never commit your real credentials to GitHub. The `.env` file is ignored by Git.

## How to Run the Application

### Run Frontend and Backend Together

From the project root, run:

```bash
npm run dev
```

Open the frontend at:

http://localhost:5173

The Vite development server proxies `/api` requests to the Express API running on port 5000.

### Run Frontend and Backend Separately

Open two terminals in the project root.

**Terminal 1 — Backend:**

```bash
npm run dev:server
```

**Terminal 2 — Frontend:**

```bash
npm run dev:client
```

### Production Build

Build the frontend:

```bash
npm run build
```

Start the API server:

```bash
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API health |
| GET | `/api/expenses` | List expenses |
| GET | `/api/expenses?search=coffee` | Search by description |
| GET | `/api/expenses?category=Food%20%26%20Dining` | Filter by category |
| POST | `/api/expenses` | Create an expense |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |
| GET | `/api/expenses/summary` | Get spending and category summaries |

### Example Expense Payload

```json
{
  "description": "Coffee",
  "amount": 4.5,
  "category": "Food & Dining",
  "date": "2026-10-11"
}
```

Amounts must be positive numbers. Supported categories are Food & Dining, Transportation, Shopping, Bills & Utilities, Entertainment, Health, Travel, and Other.

Successful responses use the `{ success, data }` structure. Errors use `{ success: false, error: { message, details? } }`.

## Testing

Run the API tests:

```bash
npm test
```

By default, tests use a temporary in-memory MongoDB database named `expense_tracker_test`. They do not load `backend/.env` or use `MONGODB_URI`.

If `TEST_MONGODB_URI` is configured, the test runner accepts it only when the database name contains `expense_tracker_test`. Never configure it to use a production or shared development database.

`mongodb-memory-server` may need to download a MongoDB binary on its first run.

## Configuration and Security

The backend supports these environment variables:

- `MONGODB_URI` — MongoDB connection string
- `PORT` — API server port
- `CLIENT_ORIGIN` — Allowed frontend origin

The application uses the `expense_tracker` database. Credentials are kept in the local `backend/.env` file and must not be committed to the repository.

The dashboard currently displays amounts in USD. To change the currency, update the currency formatter in `src/App.jsx`.

## Code0 Usage Confirmation

AI-assisted development tools were used during the development of this project to support implementation, debugging, and validation.

**Important:** Complete this section according to the tools you actually used. If Code0 was not successfully used because of its integrated authentication issues, do not claim otherwise. Explain the issue and the alternative tool used.

## AI Development Experience

AI assistance supported the development workflow, including application structure, API implementation, database integration, debugging, and testing. Generated changes were reviewed and validated through API tests and a frontend production build. Issues discovered during testing were investigated and corrected.

During development, Code0's integrated tools encountered authentication issues. The standalone Codex CLI was used as a fallback to continue implementation and verification.

## Specific AI-Assisted Development Tasks

1. **Application Structure:** Planned the React/Vite frontend and Express backend organization.
2. **REST API Development:** Implemented expense creation, listing, updating, deletion, search, filtering, and spending summaries.
3. **Database Integration:** Configured Mongoose models and MongoDB connection settings.
4. **Debugging:** Investigated and fixed an issue in the expense summary API.
5. **Testing and Validation:** Ran API tests with an isolated in-memory MongoDB database and verified the frontend production build.

## Author

**Pavan Guduru**

- GitHub: https://github.com/Pavan6524
- Portfolio: https://personal-portfolio-bice-iota.vercel.app/
