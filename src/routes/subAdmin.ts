import { Router } from 'express';
import AuthController from '../controllers/authController';
import subAdministrator from '../controllers/subAdmin';

const Auth = new AuthController();

const router = Router();
const subAdmin = new subAdministrator();
router.post('/createStaff', Auth.protect('sub-admin'), subAdmin.createStaff);

export default router;
