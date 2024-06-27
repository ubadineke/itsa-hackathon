"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const superAdmin_1 = __importDefault(require("../controllers/superAdmin"));
const Auth = new authController_1.default();
const router = (0, express_1.Router)();
const SuperAdmin = new superAdmin_1.default();
router.use(Auth.protect('super-admin'));
router.get('/organizations', SuperAdmin.organizations);
router.get('/staffs', SuperAdmin.staffs);
router.route('/technicians').post(SuperAdmin.createTechnician).get(SuperAdmin.technicians);
router.get('/devices', SuperAdmin.devices);
router.get('/maintenance', SuperAdmin.requests);
router;
exports.default = router;
