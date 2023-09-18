import { Pool } from 'pg';

const db = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'expense_tracker',
  password: 'your_db_password',
  port: 5432,
});

export default db;
