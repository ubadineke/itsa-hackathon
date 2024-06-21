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
const deviceModel_1 = __importDefault(require("../models/deviceModel"));
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
            const devices = yield deviceModel_1.default.find({ staff: req.user._id });
            if (!devices)
                return res.status(404).json('No devices attached to this user yet');
            res.status(200).json({
                status: 'success',
                devices,
            });
        });
        this.getSingleDevice = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const device = yield deviceModel_1.default.findById({ _id: id });
            if (!device)
                return res.status(404).json('No device recorded');
            res.status(200).json({
                status: 'success',
                device,
            });
        });
        this.makeMaintenanceRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // const sendEmail = new EmailSender()
            //         const {id, description} = req.body
            //         //staff wey get am
            //         const technician = await Technician.findById(id);
            //         const request = await Request.create({staff: req.user._id, device: id, description, technician })
            //     await sendEmail.sendEmail({
            //         email: technician.email,
            //         subject: 'Maintenance Request',
            //         message,
            //     }).catch(async (err) => {
            //     });
            //         // staff, device, description, technician
            //         //device id
            //         //note
            //         //store and send to the closest techincian email
        });
    }
}
exports.default = StaffController;
