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
//get long. and lat. for a technician
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const technician = {
    state: 'Akwa Ibom',
    lga: 'Etinan',
};
class Geo {
    static getCoordinates(state, lga) {
        return __awaiter(this, void 0, void 0, function* () {
            let arr = [];
            arr.push(lga.split(' '));
            arr.push(state.split(' '));
            arr = arr.flat();
            let text = '';
            for (let i = 0; i < arr.length; i++) {
                const str = `${arr[i]}%20`;
                text = text + str;
            }
            text = text + 'nigeria';
            const response = yield axios_1.default.get(`https://api.geoapify.com/v1/geocode/search?text=${text}&format=json&apiKey=${config_1.default.GEO_API_KEY}`);
            const result = response.data.results[0];
            const { lon, lat } = result;
            return [lon, lat];
        });
    }
}
exports.default = Geo;
