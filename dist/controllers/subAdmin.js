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
const requestModel_1 = __importDefault(require("../models/requestModel"));
const crypto_1 = __importDefault(require("crypto"));
const deviceModel_1 = __importDefault(require("../models/deviceModel"));
const email_1 = __importDefault(require("../utils/email"));
const Email = new email_1.default();
class subAdmin {
    constructor() {
        this.createStaff = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email } = req.body;
                if (!name || !email)
                    return res.status(400).json('Provide staff email');
                //Random password
                const password = crypto_1.default.randomBytes(10).toString('hex').slice(0, 10);
                // const password = '123456789';
                const staff = yield staffModel_1.default.create({
                    organization: req.user._id,
                    name,
                    email,
                    password,
                });
                const message = `email: ${email} \n password: ${password}`;
                yield Email.send({
                    email,
                    subject: 'Your login credentials for the ITSA Dashboard',
                    message,
                });
                res.status(200).json({
                    status: 'success',
                    logins: {
                        name,
                        email,
                        password,
                    },
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.newDeviceRequest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, email } = req.body;
                const randomString = crypto_1.default.randomBytes(10).toString('hex').slice(0, 10);
                if (user === 'staff') {
                    const staff = yield staffModel_1.default.findOne({ email });
                    if (!staff)
                        return res.status(400).json('No staff with that email found');
                    staff.requestToken = randomString;
                    yield staff.save();
                }
                else if (user === 'organization') {
                    const organization = yield orgModel_1.default.findOne({ email: req.user.email });
                    if (!organization)
                        return res.status(400).json('No organization with that email found');
                    organization.requestToken = randomString;
                    yield organization.save();
                }
                else {
                    return res.status(400).json('Provide correct user type ');
                }
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
                const { city, lon, lat, email, setupId, name, system, osInfo, mem, cpu, battery } = req.body;
                const staff = yield staffModel_1.default.findOne({ email: email });
                //if organization, send email and
                if (!staff)
                    return res.status(400).json('Staff Record not found');
                const organization = yield orgModel_1.default.findOne({ _id: staff.organization });
                // if(){
                // }else(){
                // }
                const count = yield deviceModel_1.default.countDocuments({ staff: staff._id });
                let randomString = crypto_1.default.randomBytes(5).toString('hex').slice(0, 5);
                randomString = randomString.toUpperCase();
                const deviceName = `Device ${count + 1}${randomString}`;
                if (staff.requestToken !== setupId)
                    return res.status(400).json('Setup id not correct or recorded');
                const location = { type: 'Point', coordinates: [lon, lat] };
                const device = yield deviceModel_1.default.create({
                    organization,
                    staff,
                    setupId,
                    name: deviceName,
                    system,
                    osInfo,
                    cpu,
                    mem,
                    battery,
                    city,
                    location,
                });
                console.log(device);
                res.status(200).json({
                    status: 'success',
                    message: 'System information sent successfully',
                    device,
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json('Error occurred adding a device, try again!');
            }
        });
        this.getDeviceCount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const devices = yield deviceModel_1.default.countDocuments({ organization: req.user._id });
                // const staffs = await Staff.find({ organization: req.user._id }).select('_id');
                // const staffIds = staffs.map((staff) => staff._id);
                // const devices = await Device.find({ staff: { $in: staffIds } });
                // const count = devices.length;
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
                    count: staffs.length,
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
                const device = yield staffModel_1.default.findByIdAndDelete(id);
                if (!device) {
                    return res.status(404).json('Device not found');
                }
                return res.status(204).send();
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
        // getAllDevices:Base = async(req, res)=> {
        // }
        this.getSingleDevice = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const device = yield deviceModel_1.default.findById(id);
                if (!device)
                    return res.status(404).json('No devices found');
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
        this.getDevices = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // const staffs = await Staff.find({ organization: req.user._id }).select('_id');
                // const staffIds = staffs.map((staff) => staff._id);
                // const devices = await Device.find({ staff: { $in: staffIds } });
                const devices = yield deviceModel_1.default.find({ organization: req.user._id });
                if (!devices)
                    return res.status(400).json('No devices found');
                res.status(200).json({
                    status: 'success',
                    count: devices.length,
                    devices,
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.staffCount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const staffs = yield staffModel_1.default.countDocuments({ organization: req.user._id });
                if (!staffs)
                    return res.status(404).json('Staffs not found');
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
        this.ongoingMaintenance = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const devices = yield requestModel_1.default.countDocuments({
                    organization: req.user._id,
                    status: 'ongoing',
                });
                if (!devices)
                    return res.status(404).json('Devices not found');
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
        this.getRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.user;
                const { status } = req.body;
                let requests;
                if (!status) {
                    requests = yield requestModel_1.default.find({ organization: _id }).sort({
                        updatedAt: -1,
                    });
                }
                if (status) {
                    requests = yield requestModel_1.default.find({ organization: _id, status: status }).sort({
                        updatedAt: -1,
                    });
                }
                if (!requests || requests.length === 0)
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
    }
}
exports.default = subAdmin;
