"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
// import { login } from '../controllers/authController';
const router = (0, express_1.Router)();
const Auth = new authController_1.default();
router.post('/signup', Auth.signup);
router.post('/login', Auth.login);
exports.default = router;
