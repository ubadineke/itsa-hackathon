import { Router } from 'express';
import AuthController from '../controllers/authController';
import subAdministrator from '../controllers/subAdmin';

const Auth = new AuthController();

const router = Router();
const subAdmin = new subAdministrator();
router.post('/create-staff', Auth.protect('sub-admin'), subAdmin.createStaff);
router.post('/new-request', Auth.protect('sub-admin'), subAdmin.newDeviceRequest);
router.post('/register-device', subAdmin.collectInfo);

export default router;
