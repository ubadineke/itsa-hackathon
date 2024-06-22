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
const crypto_1 = __importDefault(require("crypto"));
const deviceModel_1 = __importDefault(require("../models/deviceModel"));
class subAdmin {
    constructor() {
        this.createStaff = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email } = req.body;
                if (!name || !email)
                    return res.status(400).json('Provide staff email');
                //Random password
                const password = crypto_1.default.randomBytes(10).toString('hex').slice(0, 10);
                // console.log(req.user);
                const staff = yield staffModel_1.default.create({
                    organization: req.user._id,
                    name,
                    email,
                    password,
                });
                res.status(200).json({
                    status: 'success',
                    logins: {
                        name,
                        email,
                        password,
                    },
                    //send mail to staff
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.newDeviceRequest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const randomString = crypto_1.default.randomBytes(10).toString('hex').slice(0, 10);
                yield staffModel_1.default.findOneAndUpdate({ email: req.body.email }, { requestToken: randomString }, { new: true });
                res.status(200).json({
                    status: 'success',
                    setupId: randomString,
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.collectInfo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, setupId, name, system, osInfo, mem, cpu, battery } = req.body;
                console.log(email, setupId);
                const staff = yield staffModel_1.default.findOne({ email: email });
                if (!staff)
                    return res.status(400).json('Staff Record not found');
                if (staff.requestToken !== setupId)
                    return res.status(400).json('Setup id not correct or not recorded');
                const device = yield deviceModel_1.default.create({
                    staff,
                    setupId,
                    name,
                    system,
                    osInfo,
                    cpu,
                    mem,
                    battery,
                });
                console.log(device);
                res.status(200).json({
                    status: 'success',
                    device,
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.getAllDevices = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const devices = yield deviceModel_1.default.countDocuments();
                res.status(200).json({
                    status: 'success',
                    devices,
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.setupStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { setupId } = req.params;
                const { _id } = req.user;
                const device = yield deviceModel_1.default.findOne({ setupId });
                if (!device)
                    return res.status(404).json('Not found');
                res.status(200).json({
                    status: 'success',
                    device,
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.getAllStaffs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const staffs = yield staffModel_1.default.find({ organization: req.user._id });
                if (!staffs)
                    return res.status(404).json('No staffs recorded');
                res.status(200).json({
                    status: 'success',
                    staffs,
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.deleteStaff = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield staffModel_1.default.findByIdAndDelete(id);
                res.status(204).send;
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.getProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = req.user;
                res.status(200).json({
                    status: 'success',
                    profile,
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.updateProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.user;
                const { name, phone } = req.body;
                const profile = yield orgModel_1.default.findByIdAndUpdate(_id, { name, phone }, { new: true });
                res.status(200).json({
                    status: 'success',
                    profile,
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
    }
}
exports.default = subAdmin;
