# Cheker-HP Backend

A minimal Express.js backend using MySQL (mysql2).

Setup

1. Copy `.env.example` to `.env` and fill database credentials.
2. Install dependencies:

   ```cmd
   cd "C:\Users\Lenovo\OneDrive\Desktop\CHECKER HP\cheker-hp"
   npm install
   ```

3. Create the database and table (use `sql/schema.sql`):

   ```sql
   -- run in your MySQL client
   SOURCE sql/schema.sql;
   ```

4. Run the server in dev mode:

   ```cmd
   npm run dev
   ```

API

- GET /api/users
- GET /api/users/:id
- POST /api/users  { name, email }
- PUT /api/users/:id { name, email }
- DELETE /api/users/:id

Notes

- Use `.env` to set DB config.
- This is a minimal starter; add validation, authentication, and proper error handling for production.
