import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Config from './config';
import authRouter from './routes/authRoutes';
import subAdminRouter from './routes/subAdmin';
import staffRouter from './routes/staffRoutes';
import superAdminRouter from './routes/superAdmin';

dotenv.config();
console.log(process.env.DB);

// global.env = process.env.DB;
Config.connectToDatabase();
// connectDB;
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', authRouter);
app.use('/api/sub-admin', subAdminRouter);
app.use('/api/staff', staffRouter);
app.use('/api/super-admin', superAdminRouter);
// app.get('/', (req: Request, res: Response) => {
//     console.log('done');
// });

const PORT = Config.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
