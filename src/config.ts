import dotenv from 'dotenv';
import * as Joi from 'joi';
import mongoose, { Connection } from 'mongoose';
dotenv.config();

interface EnvConfig {
    ENV: 'development' | 'production' | 'test';
    PORT: number;
    DB_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    GMAIL_NAME: string;
    GMAIL_PASSWORD: string;
    GEO_API_KEY: string;
}

const envSchema = Joi.object({
    ENV: Joi.string().valid('development', 'production', 'test').required(),
    PORT: Joi.number().default(3000),
    DB_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().required(),
    GMAIL_NAME: Joi.string().required(),
    GMAIL_PASSWORD: Joi.string().required(),
    GEO_API_KEY: Joi.string().required(),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env, { allowUnknown: true });

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

class Config implements EnvConfig {
    ENV: 'development' | 'production' | 'test';
    PORT: number;
    DB_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    GMAIL_NAME: string;
    GMAIL_PASSWORD: string;
    GEO_API_KEY: string;

    private dbConnection: Connection | null = null;

    constructor(config: EnvConfig) {
        this.ENV = config.ENV;
        this.PORT = config.PORT;
        this.DB_URL = config.DB_URL;
        this.JWT_SECRET = config.JWT_SECRET;
        this.JWT_EXPIRES_IN = config.JWT_EXPIRES_IN;
        this.GMAIL_NAME = config.GMAIL_NAME;
        this.GMAIL_PASSWORD = config.GMAIL_PASSWORD;
        this.GEO_API_KEY = config.GEO_API_KEY;
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
