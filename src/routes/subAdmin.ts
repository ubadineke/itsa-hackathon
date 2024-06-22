import { Router } from 'express';
import AuthController from '../controllers/authController';
import subAdministrator from '../controllers/subAdmin';

const Auth = new AuthController();

const router = Router();
const subAdmin = new subAdministrator();
router.post('/register-device', subAdmin.collectInfo);

router.use(Auth.protect('sub-admin'));
router.post('/create-staff', subAdmin.createStaff);
router.post('/new-request', subAdmin.newDeviceRequest);
router.get('/setup-status/:setupId', subAdmin.setupStatus);
router.get('/enrolled-devices', subAdmin.getAllDevices);
router.route('/staffs').get(subAdmin.getAllStaffs);
router.route('/profile').get(subAdmin.getProfile).patch(subAdmin.updateProfile);
// router.get('/profile', subAdmin.getProfile);

export default router;
