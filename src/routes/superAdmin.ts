import { Router } from 'express';
import AuthController from '../controllers/authController';
import SuperAdminController from '../controllers/superAdmin';

const Auth = new AuthController();

const router = Router();
const SuperAdmin = new SuperAdminController();

router.use(Auth.protect('super-admin'));
router.post('/technician', SuperAdmin.createTechnician);

export default router;
