import { Router } from 'express';
import AuthController from '../controllers/authController';
import StaffController from '../controllers/staffController';

const Auth = new AuthController();

const router = Router();
const Staff = new StaffController();

router.use(Auth.protect('staff'));
router.get('/device-count', Staff.deviceCount);
router.get('/devices', Staff.listDevices);
router.get('/device', Staff.getSingleDevice);

export default router;
