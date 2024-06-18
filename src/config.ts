import dotenv from 'dotenv';
import * as Joi from 'joi';
import mongoose, { Connection } from 'mongoose';
dotenv.config();

interface EnvConfig {
    ENV: 'development' | 'production' | 'test';
    PORT: number;
    DB_URL: string;
}

const envSchema = Joi.object({
    ENV: Joi.string().valid('development', 'production', 'test').required(),
    PORT: Joi.number().default(3000),
    DB_URL: Joi.string().required(),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env, { allowUnknown: true });

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

class Config implements EnvConfig {
    ENV: 'development' | 'production' | 'test';
    PORT: number;
    DB_URL: string;

    private dbConnection: Connection | null = null;

    constructor(config: EnvConfig) {
        this.ENV = config.ENV;
        this.PORT = config.PORT;
        this.DB_URL = config.DB_URL;
    }

    public async connectToDatabase() {
        const connection = await mongoose
            .connect(this.DB_URL)
            .then(() => console.log('DATABASE CONNECTED'))
            .catch((error: any) => {
                console.error('MongoDB connection error:', error.message);
                process.exit(1);
            });
    }
}

const configInstance = new Config(envVars);

export default configInstance;
