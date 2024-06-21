import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import Config from './config';
import authRouter from './routes/authRoutes';
import subAdminRouter from './routes/subAdmin';
import staffRouter from './routes/staffRoutes';

dotenv.config();
console.log(process.env.DB);

// global.env = process.env.DB;
Config.connectToDatabase();
// connectDB;
const app = express();

app.use(express.json());
app.use('/api', authRouter);
app.use('/api/sub-admin', subAdminRouter);
app.use('/api/staff', staffRouter);
// app.get('/', (req: Request, res: Response) => {
//     console.log('done');
// });

const PORT = Config.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
