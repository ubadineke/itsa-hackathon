import { Router } from 'express';
import AuthController from '../controllers/authController';
import SuperAdminController from '../controllers/superAdmin';

const Auth = new AuthController();

const router = Router();
const SuperAdmin = new SuperAdminController();

router.use(Auth.protect('super-admin'));
router.get('/organizations', SuperAdmin.organizations);
router.get('/staffs', SuperAdmin.staffs);
router.route('/technicians').post(SuperAdmin.createTechnician).get(SuperAdmin.technicians);
router.get('/devices', SuperAdmin.staffs);
router;

export default router;
