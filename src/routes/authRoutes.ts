import express from 'express';
import passport from 'passport';
import { createUser} from '../controllers/authControllers';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Logged in successfully' });
});

export default router;