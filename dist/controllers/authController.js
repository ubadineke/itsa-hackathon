"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orgModel_1 = __importDefault(require("../models/orgModel"));
const staffModel_1 = __importDefault(require("../models/staffModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtToken_1 = __importDefault(require("../utils/jwtToken"));
const util_1 = require("util");
const config_1 = __importDefault(require("../config"));
const superAdmin_1 = __importDefault(require("../models/superAdmin"));
const technicianModel_1 = __importDefault(require("../models/technicianModel"));
const Jwt = new jwtToken_1.default();
class AuthController {
    constructor() {
        this.signup = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, password } = req.body;
                const organization = yield orgModel_1.default.create({ name, email, phone, password });
                Jwt.createAndSend(organization, 201, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        // public signup: Base = async (req, res, next) => {
        //     try {
        //         const { email, password } = req.body;
        //         const admin = await Admin.create({ email, password });
        //         Jwt.createAndSend(admin, 201, res);
        //     } catch (err) {
        //         console.log(err);
        //         res.status(500).json(err);
        //     }
        // };
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, role } = req.body;
                if (!email || !password) {
                    return res.status(400).json({
                        status: 'fail',
                        message: 'Please provide email and password',
                    });
                }
                let user = null;
                if (role === 'sub-admin') {
                    user = yield orgModel_1.default.findOne({ email: email }).select('+password');
                }
                else if (role === 'staff') {
                    user = yield staffModel_1.default.findOne({ email }).select('+password');
                }
                else if (role === 'super-admin') {
                    user = yield superAdmin_1.default.findOne({ email }).select('+password');
                }
                else if (role === 'technician') {
                    user = yield technicianModel_1.default.findOne({ email }).select('+password');
                }
                else {
                    return res.status(404).json('Specify correct role');
                }
                if (!user || !(yield user.correctPassword(password, user.password))) {
                    return res.status(401).json({
                        status: 'fail',
                        message: 'Incorrect email or password',
                    });
                }
                if (user.role !== role) {
                    return res.status(400).json({
                        status: 'fail',
                        message: `No ${role} record found`,
                    });
                }
                Jwt.createAndSend(user, 200, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.protect = (role) => {
            return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    this.role = role;
                    // console.log(this.role);
                    let token;
                    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                        token = req.headers.authorization.split(' ')[1];
                    }
                    if (!token) {
                        return res
                            .status(401)
                            .json('You are not logged in. Please log in to gain access!');
                        // return next(new AppError('You are not logged in. Please log in to gain access!', 401));
                    }
                    //2) Verifying token
                    const verifyJwt = (0, util_1.promisify)(jsonwebtoken_1.default.verify);
                    const decoded = yield verifyJwt(token, config_1.default.JWT_SECRET).catch((err) => {
                        return res.status(401).json('Invalid token, Please log in again!');
                        // return next(new AppError('Invalid token, Please log in again!', 401));
                    });
                    // //3) Check if user still exists
                    let currentUser;
                    if (this.role === 'sub-admin') {
                        currentUser = yield orgModel_1.default.findById(decoded.id);
                    }
                    else if (this.role === 'staff') {
                        currentUser = yield staffModel_1.default.findById(decoded.id);
                    }
                    else if (this.role === 'super-admin') {
                        currentUser = yield superAdmin_1.default.findById(decoded.id);
                    }
                    else if (this.role === 'technician') {
                        currentUser = yield technicianModel_1.default.findById(decoded.id);
                    }
                    else {
                        return res.status(400).json('Provide the accepted user roles');
                    }
                    if (!currentUser) {
                        return res
                            .status(401)
                            .json("The user belonging to this token does not exist/you're not permitted to accesss this feature");
                        //     // return next(new AppError('The user belonging to this token does not exist', 401));
                    }
                    // // //store user details
                    req.user = currentUser;
                    next();
                }
                catch (err) {
                    console.log(err);
                    res.status(500).json(err);
                }
            });
        };
        this.cronPing = (req, res) => __awaiter(this, void 0, void 0, function* () {
            return res.send('Cron Did');
        });
    }
}
exports.default = AuthController;
