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
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const adminSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Please provide your email address'],
        unique: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false,
    },
    role: {
        type: String,
        required: true,
        enum: ['super-admin'],
        default: 'super-admin',
    },
}, { timestamps: true });
adminSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        //ONly run this function if password was actually modified
        if (!this.isModified('password'))
            return next();
        //Hash the password with cost of 12
        this.password = yield bcryptjs_1.default.hash(this.password, 8);
        next();
    });
});
adminSchema.methods.correctPassword = function (incomingPassword, storedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(incomingPassword, storedPassword);
    });
};
const Admin = (0, mongoose_1.model)('Admin', adminSchema);
exports.default = Admin;
