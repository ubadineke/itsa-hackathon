import { Router } from 'express';
import AuthController from '../controllers/authController';
import subAdministrator from '../controllers/subAdmin';

const Auth = new AuthController();

const router = Router();
const subAdmin = new subAdministrator();
router.post('/register-device', subAdmin.collectInfo);

router.use(Auth.protect('sub-admin'));
router.route('/staffs').post(subAdmin.createStaff).get(subAdmin.getAllStaffs);
router.delete('/staffs/:id', subAdmin.deleteStaff);
router.post('/new-request', subAdmin.newDeviceRequest);
router.get('/setup-status/:setupId', subAdmin.setupStatus);
router.get('/enrolled-devices', subAdmin.getDeviceCount);
router.route('/profile').get(subAdmin.getProfile).patch(subAdmin.updateProfile);
router.route('/device/:id').get(subAdmin.getSingleDevice);
router.get('/devices', subAdmin.getDevices);

export default router;
