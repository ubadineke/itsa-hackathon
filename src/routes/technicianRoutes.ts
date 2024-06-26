import { Router } from 'express';
import AuthController from '../controllers/authController';
import TechnicianController from '../controllers/technician';

const Auth = new AuthController();

const router = Router();
const Technician = new TechnicianController();

router.use(Auth.protect('technician'));
router.route('/requests').get(Technician.getRequest).patch(Technician.updateRequest);
router.route('/profile').get(Technician.getProfile).patch(Technician.updateProfile);

export default router;
