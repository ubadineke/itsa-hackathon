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
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false,
        },
        role: {
            type: String,
            enum: ['technician'],
            default: 'technician',
        },
        phone: {
            type: String,
        },
        state: {
            type: String,
            required: [true, 'Please provide your state '],
        },
        lga: {
            type: String,
            required: [true, 'Please provide the lga you reside '],
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
    },
    { timestamps: true }
);

technicianSchema.pre<ITechnician>('save', async function (next) {
    //ONly run this function if password was actually modified
    if (!this.isModified('password')) return next();

    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 8);

    next();
});

technicianSchema.methods.correctPassword = async function (
    incomingPassword: string,
    storedPassword: string
) {
    return await bcrypt.compare(incomingPassword, storedPassword);
};

technicianSchema.index({ location: '2dsphere' });

const Technician = model<ITechnician>('Technician', technicianSchema);
export default Technician;
