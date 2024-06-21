import { Router } from 'express';
import AuthController from '../controllers/authController';
import StaffController from '../controllers/staffController';

const Auth = new AuthController();

const router = Router();
const Staff = new StaffController();

export default router;
