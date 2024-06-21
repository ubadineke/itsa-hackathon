"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("./config"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const subAdmin_1 = __importDefault(require("./routes/subAdmin"));
const staffRoutes_1 = __importDefault(require("./routes/staffRoutes"));
dotenv_1.default.config();
console.log(process.env.DB);
// global.env = process.env.DB;
config_1.default.connectToDatabase();
// connectDB;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', authRoutes_1.default);
app.use('/api/sub-admin', subAdmin_1.default);
app.use('/api/staff', staffRoutes_1.default);
// app.get('/', (req: Request, res: Response) => {
//     console.log('done');
// });
const PORT = config_1.default.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
