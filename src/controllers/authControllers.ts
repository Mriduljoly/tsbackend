import { Request, Response } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import db from '../../Database';
import { User } from '../models/User';


export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save user to the database
    // You'll need to implement this part using your database connection
    // Example: await db.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
      // Fetch user from the database using id
      const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  
      if (rows.length === 0) {
        return done(new Error('User not found'));
      }
  
      const user: User = rows[0];
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  
  