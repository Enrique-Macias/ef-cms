import { Router } from 'express';
import {
  register,
  login,
  logout,
  requestPasswordReset,
  resetPassword,
} from '../controllers/authController';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
