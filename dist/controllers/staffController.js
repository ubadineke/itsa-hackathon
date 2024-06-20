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
const staffModel_1 = __importDefault(require("../models/staffModel"));
const crypto_1 = __importDefault(require("crypto"));
class StaffController {
    constructor() {
        this.newDeviceRequest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const randomString = crypto_1.default.randomBytes(6).toString('hex').slice(0, 6);
                const token = yield staffModel_1.default.findByIdAndUpdate(req.user._id, { requestToken: randomString }, { new: true });
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
                const { email, setupId } = req.body;
                console.log(email, setupId);
                const staff = yield staffModel_1.default.findOne({ email });
                if (!staff)
                    return res.status(400).json('Staff Record not found');
                if (staff.requestToken !== setupId)
                    return res.status(400).json('Setup id not correct or not recorded');
                console.log(req.body);
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
    }
}
exports.default = StaffController;
