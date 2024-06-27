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
const technicianModel_1 = __importDefault(require("../models/technicianModel"));
const deviceModel_1 = __importDefault(require("../models/deviceModel"));
const geo_1 = __importDefault(require("../utils/geo"));
const randomString_1 = __importDefault(require("../utils/randomString"));
class SuperAdminController {
    constructor() {
        //create technician
        this.createTechnician = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, state, lga } = req.body;
                const password = (0, randomString_1.default)(10);
                const coordinates = yield geo_1.default.getCoordinates(state, lga);
                const location = {
                    type: 'Point',
                    coordinates: [...coordinates],
                };
                const technician = yield technicianModel_1.default.create({
                    name,
                    email,
                    password,
                    phone,
                    state,
                    lga,
                    location,
                });
                res.status(200).json({
                    status: 'success',
                    email,
                    password,
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.organizations = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { count } = req.body;
                let organizations;
                if (count === 'yes') {
                    organizations = yield orgModel_1.default.countDocuments();
                }
                else {
                    organizations = yield orgModel_1.default.find();
                }
                if (!organizations)
                    return res.status(404).json('No organizations found');
                res.status(200).json({
                    status: 'success',
                    organizations,
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.staffs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { count } = req.body;
                let staffs;
                if (count === 'yes') {
                    staffs = yield staffModel_1.default.countDocuments();
                }
                else {
                    staffs = yield staffModel_1.default.find();
                }
                if (!staffs)
                    return res.status(404).json('No staffs found');
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
        this.technicians = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { count } = req.body;
                let technicians;
                if (count === 'yes') {
                    technicians = yield technicianModel_1.default.countDocuments();
                }
                else {
                    technicians = yield technicianModel_1.default.find().select('-location');
                }
                if (!technicians)
                    return res.status(404).json('Technicians not found');
                res.status(200).json({
                    status: 'success',
                    technicians,
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.devices = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { count } = req.body;
                let devices;
                if (count === 'yes') {
                    devices = yield deviceModel_1.default.countDocuments();
                }
                else {
                    devices = yield deviceModel_1.default.find().select('-location');
                }
                if (!devices)
                    return res.status(404).json('Device not found');
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
    }
}
exports.default = SuperAdminController;
