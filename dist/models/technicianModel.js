"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const technicianSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email address'],
        unique: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, 'Please provide a valid email'],
    },
    state: {
        type: String,
        required: [true, 'Please provide your state '],
    },
    lga: {
        type: String,
        required: [true, 'Please provide the lga you reside '],
    },
}, { timestamps: true });
const Technician = (0, mongoose_1.model)('Technician', technicianSchema);
exports.default = Technician;
