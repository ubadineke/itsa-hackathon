import { Router } from 'express';
import AuthController from '../controllers/authController';
import StaffController from '../controllers/staffController';

const Auth = new AuthController();

const router = Router();
const Staff = new StaffController();

router.use(Auth.protect('staff'));
router.get('/device-count', Staff.deviceCount);
router.get('/devices', Staff.listDevices);
router.get('/device/:id', Staff.getSingleDevice);
router.post('/maintenance', Staff.makeMaintenanceRequest);
router.route('/profile').get(Staff.getProfile).patch(Staff.updateProfile);

export default router;
