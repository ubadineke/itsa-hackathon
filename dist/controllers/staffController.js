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
const deviceModel_1 = __importDefault(require("../models/deviceModel"));
const requestModel_1 = __importDefault(require("../models/requestModel"));
const email_1 = __importDefault(require("../utils/email"));
const getNearest_1 = __importDefault(require("../utils/getNearest"));
class StaffController {
    constructor() {
        this.deviceCount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const devices = yield deviceModel_1.default.countDocuments({ staff: req.user._id });
                res.status(200).json({
                    status: 'success',
                    devices,
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({
                    status: 'success',
                    err,
                });
            }
        });
        this.listDevices = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const devices = yield deviceModel_1.default.find({ staff: req.user._id });
                if (!devices)
                    return res.status(404).json('No devices attached to this user yet');
                res.status(200).json({
                    status: 'success',
                    devices,
                });
            }
            catch (err) { }
        });
        this.getSingleDevice = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const device = yield deviceModel_1.default.findById({ _id: id });
                if (!device)
                    return res.status(404).json('No device recorded');
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
        this.makeMaintenanceRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id, priority, description } = req.body;
                const device = yield deviceModel_1.default.findById(id);
                if (!device)
                    return res.status(400).json('Device not found');
                const coordinates = device === null || device === void 0 ? void 0 : device.location.coordinates;
                const technician = yield (0, getNearest_1.default)(coordinates);
                if (!technician[0])
                    return res.status(400).json('No technicians found');
                const sendEmail = new email_1.default();
                const request = yield requestModel_1.default.create({
                    organization: req.user.organization,
                    staff: req.user,
                    device,
                    description,
                    priority,
                    technician: technician[0]._id,
                });
                yield sendEmail
                    .send({
                    email: (_a = technician[0]) === null || _a === void 0 ? void 0 : _a.email,
                    subject: 'Maintenance Request',
                    message: description,
                })
                    .catch((err) => console.log(err));
                res.status(200).json({
                    status: 'success',
                    request,
                    technician,
                });
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
                const { name } = req.body;
                const profile = yield staffModel_1.default.findByIdAndUpdate(_id, { name }, { new: true });
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
        this.getMaintenanceCount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { status } = req.query;
                let requests;
                if (status) {
                    requests = yield requestModel_1.default.countDocuments({
                        staff: req.user._id,
                        status: status,
                    });
                }
                else {
                    requests = yield requestModel_1.default.countDocuments({ staff: req.user._id });
                }
                if (!requests)
                    return res.status(404).json('No requests found');
                res.status(200).json({
                    status: 'success',
                    requests,
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.getMaintenanceRequests = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const { _id } = req.user;
                const { status } = req.params;
                let requests;
                if (!status) {
                    console.log(1);
                    requests = yield requestModel_1.default.find({ staff: _id }).sort({
                        updatedAt: -1,
                    });
                    console.log(4);
                }
                console.log(_id);
                if (status) {
                    console.log(2);
                    requests = yield requestModel_1.default.find({ staff: _id, status: status }).sort({
                        updatedAt: -1,
                    });
                    console.log(3);
                }
                if (!requests || requests.length === 0) {
                    console.log(1);
                    return res.status(404).json('No requests found');
                }
                console.log('2', requests.length);
                res.status(200).json({
                    status: 'success',
                    count: requests.length,
                    requests,
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        //get requests based on that staff
        //get them by status of request
        //count of the requests so far
        //count of the outgoing maintenance
        // Staff: Base = async(req, res)=> {
        // }
    }
}
exports.default = StaffController;
