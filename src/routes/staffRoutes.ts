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
router.route('/maintenance').post(Staff.makeMaintenanceRequest).get(Staff.getMaintenanceRequests);
router.route('/profile').get(Staff.getProfile).patch(Staff.updateProfile);
router.get('/maintenance-count', Staff.getMaintenanceCount);
export default router;
