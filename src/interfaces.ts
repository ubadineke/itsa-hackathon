import mongoose, { model, Document, Schema } from 'mongoose';
import { ObjectId } from './types';
import { Request, Response, NextFunction } from 'express';

//Interface defining the types for parameters to shorten typing
export interface Base {
    (req: Request, res: Response, next: NextFunction): {};
}

//Interface for Organization
export interface IOrganization extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    requestToken: string;
    correctPassword(incomingPassword: string, storedPassword: string): Promise<boolean>;
}

//Interface for Staff
export interface IStaff extends Document {
    _id: ObjectId;
    organization: ObjectId;
    name: string;
    email: string;
    password: string;
    role: string;
    requestToken?: string;
    correctPassword(incomingPassword: string, storedPassword: string): Promise<boolean>;
}

export interface IAdmin extends Document {
    _id: ObjectId;
    email: string;
    password: string;
    role: string;
    correctPassword(incomingPassword: string, storedPassword: string): Promise<boolean>;
}

export interface ITechnician extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    role: string;
    phone: string;
    password: string;
    state: string;
    lga: string;
    location: {
        type: string;
        coordinates: [];
    };
}

export interface IDevice extends Document {
    organization: ObjectId;
    staff: ObjectId;
    name: string;
    setupId: string;
    system: {};
    osInfo: {};
    cpu: {};
    mem: {};
    battery: {};
    city: string;
    location: {
        type: string;
        coordinates: [];
    };
}

export interface IRequest extends Document {
    organization: ObjectId;
    staff: ObjectId;
    device: ObjectId;
    description: string;
    priority: string;
    technician: ObjectId;
    status: string;
}
