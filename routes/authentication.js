import express from 'express';
import { createAccount, login, logout } from '../controllers/authenticationController.js';

// session
// cookies

const router = express.Router();

// POST create account function
router.post('/', createAccount);
// POST login authentication
router.post('/login', login);
// log a user out of their account
router.get('/logout', logout);

export default router;