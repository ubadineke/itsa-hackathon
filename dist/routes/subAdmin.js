"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const subAdmin_1 = __importDefault(require("../controllers/subAdmin"));
const Auth = new authController_1.default();
const router = (0, express_1.Router)();
const subAdmin = new subAdmin_1.default();
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
router.get('/staff-count', subAdmin.staffCount);
router.get('/ongoing', subAdmin.ongoingMaintenance);
router.get('/maintenance-request', subAdmin.getRequest);
exports.default = router;
