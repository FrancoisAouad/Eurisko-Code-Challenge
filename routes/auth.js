import express from 'express';
import { verifyEmail } from '../controllers/authentication/userActivation.js';
import {
    login,
    register,
    logout,
    refreshToken,
} from '../controllers/authentication/auth.js';
import {
    forgotPassword,
    resetPassword,
} from '../controllers/authentication/resetPasssword.js';
import { isEmailVerified } from '../middleware/secure/isUserVerified.js';
import { verifyAccessToken } from '../controllers/jwt/verifyJWT.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refreshToken', verifyAccessToken, refreshToken);
router.post(
    '/forgotPassword',
    verifyAccessToken,
    isEmailVerified,
    forgotPassword
);

router.delete('/logout', verifyAccessToken, isEmailVerified, logout);

router.get('/verify', verifyEmail);

router.patch('/resetPassword/:token', resetPassword);

export default router;
