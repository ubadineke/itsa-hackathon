"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
function randomString(num) {
    const string = crypto_1.default.randomBytes(num).toString('hex').slice(0, num);
    return string;
}
exports.default = randomString;
