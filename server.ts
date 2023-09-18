import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { User } from './src/models/User'; // Import your User type or interface
import authRoutes from './src/routes/authRoutes';
import expenseRoutes from './src/routes/expenseRoutes';
import { Pool, QueryResult } from 'pg'; // Import the necessary PostgreSQL types

const app = express();
const port = 3000;

// Initialize your database connection pool
const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'expense_tracker',
  password: 'Mriduljoly@9032',
  port: 5432,
});

async function findUserByUsername(username: string): Promise<User | undefined> {
  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];
    const result: QueryResult = await pool.query(query, values);

    if (result.rowCount === 0) {
      return undefined; // User not found
    }

    const user: User = result.rows[0]; // Assuming the first row is the user
    return user;
  } catch (error) {
    throw error;
  }
}

app.use(express.json());
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy for authentication
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Explicitly specify the type of user
      const user: User | undefined = await findUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return done(null, false, { message: 'Invalid password' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Passport serialization and deserialization (already defined in authController)

app.use('/auth', authRoutes);
app.use('/api', expenseRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

