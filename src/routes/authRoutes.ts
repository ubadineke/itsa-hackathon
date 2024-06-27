import { Request, Response, NextFunction, Router } from 'express';

import AuthController from '../controllers/authController';
// import { login } from '../controllers/authController';

const router = Router();
const Auth = new AuthController();
router.post('/signup', Auth.signup);
router.post('/login', Auth.login);
router.post('/ping', Auth.cronPing);

export default router;
