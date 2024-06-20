"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const staffController_1 = __importDefault(require("../controllers/staffController"));
const Auth = new authController_1.default();
const router = (0, express_1.Router)();
const Staff = new staffController_1.default();
router.post('/staff/new-request', Auth.protect('staff'), Staff.newDeviceRequest);
router.post('/staff/register-device', Staff.collectInfo);
exports.default = router;
