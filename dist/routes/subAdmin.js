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
router.post('/create-staff', Auth.protect('sub-admin'), subAdmin.createStaff);
router.post('/new-request', Auth.protect('sub-admin'), subAdmin.newDeviceRequest);
router.post('/register-device', subAdmin.collectInfo);
exports.default = router;
