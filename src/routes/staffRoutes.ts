import { Router } from 'express';
import AuthController from '../controllers/authController';
import StaffController from '../controllers/staffController';

const Auth = new AuthController();

const router = Router();
const Staff = new StaffController();
router.post('/staff/new-request', Auth.protect('staff'), Staff.newDeviceRequest);
router.post('/staff/register-device', Staff.collectInfo);

export default router;
