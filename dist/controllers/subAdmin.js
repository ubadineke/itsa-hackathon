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
class subAdmin {
    constructor() {
        this.createStaff = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email)
                    return res.status(400).json('Provide staff email');
                //Random password
                const password = crypto_1.default.randomBytes(10).toString('hex').slice(0, 10);
                // console.log(req.user);
                const staff = yield staffModel_1.default.create({
                    organization: req.user._id,
                    email,
                    password,
                });
                res.status(200).json({
                    status: 'success',
                    logins: {
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
    }
}
exports.default = subAdmin;
