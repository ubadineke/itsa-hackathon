import { Router } from 'express';

import subAdministrator from '../controllers/subAdmin';

const router = Router();
const subAdmin = new subAdministrator();
router.post('/createStaff', subAdmin.createStaff);

export default router;
