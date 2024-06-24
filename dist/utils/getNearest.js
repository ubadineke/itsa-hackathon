"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const technicianModel_1 = __importDefault(require("../models/technicianModel"));
function getNearest(arr) {
    const location = technicianModel_1.default.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: arr,
                },
            },
        },
    }).limit(1);
    return location;
}
exports.default = getNearest;
