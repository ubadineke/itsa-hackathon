import mongoose, { model, Document, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { ObjectId } from '../types';
import { ITechnician } from '../interfaces';

const technicianSchema = new Schema<ITechnician>(
    {
        name: {
            type: String,
            required: [true, 'Please provide your name'],
        },
        email: {
            type: String,
            required: [true, 'Please provide your email address'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        state: {
            type: String,
            required: [true, 'Please provide your state '],
        },
        lga: {
            type: String,
            required: [true, 'Please provide the lga you reside '],
        },
    },
    { timestamps: true }
);

const Technician = model<ITechnician>('Technician', technicianSchema);
export default Technician;
