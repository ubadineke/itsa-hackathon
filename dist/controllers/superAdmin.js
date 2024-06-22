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
const technicianModel_1 = __importDefault(require("../models/technicianModel"));
const geo_1 = __importDefault(require("../utils/geo"));
class SuperAdminController {
    constructor() {
        //create technician
        this.createTechnician = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, state, lga } = req.body;
                const coordinates = yield geo_1.default.getCoordinates(state, lga);
                const location = {
                    type: 'Point',
                    coordinates: [...coordinates],
                };
                const technician = yield technicianModel_1.default.create({
                    name,
                    email,
                    phone,
                    state,
                    lga,
                    location,
                });
                console.log(technician);
                res.status(200).json({
                    status: 'success',
                    technician,
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).json(err);
            }
        });
    }
}
exports.default = SuperAdminController;
