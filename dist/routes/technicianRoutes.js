"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const technician_1 = __importDefault(require("../controllers/technician"));
const Auth = new authController_1.default();
const router = (0, express_1.Router)();
const Technician = new technician_1.default();
router.use(Auth.protect('technician'));
router.route('/requests').get(Technician.getRequest).patch(Technician.updateRequest);
exports.default = router;
