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
const requestModel_1 = __importDefault(require("../models/requestModel"));
class TechnicianController {
    constructor() {
        this.getRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.user;
                const { status } = req.body;
                console.log(status);
                let requests;
                if (!status) {
                    requests = yield requestModel_1.default.find({ technician: _id });
                }
                if (status) {
                    requests = yield requestModel_1.default.find({ technician: _id, status: status });
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
        this.updateRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, status } = req.body;
                if (!id || !status)
                    return res.status(400).json('Provide id and/or status');
                const request = yield requestModel_1.default.findByIdAndUpdate({ _id: id }, { status }, { new: true });
                if (!request)
                    return res.status(404).json('No request found');
                res.status(200).json({
                    status: 'success',
                    request,
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.ongoingRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                const requests = yield requestModel_1.default.find({ technnician: _id, status: 'ongoing' });
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
    }
}
exports.default = TechnicianController;
