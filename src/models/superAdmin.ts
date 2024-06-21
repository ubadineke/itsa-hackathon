import mongoose, { model, Document, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { ObjectId } from '../types';
import { IAdmin } from '../interfaces';

const adminSchema = new Schema<IAdmin>(
    {
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
            required: true,
            enum: ['super-admin'],
            default: 'super-admin',
        },
    },
    { timestamps: true }
);

adminSchema.pre<IAdmin>('save', async function (next) {
    //ONly run this function if password was actually modified
    if (!this.isModified('password')) return next();

    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 8);

    next();
});

adminSchema.methods.correctPassword = async function (
    incomingPassword: string,
    storedPassword: string
) {
    return await bcrypt.compare(incomingPassword, storedPassword);
};

const Admin = model<IAdmin>('Admin', adminSchema);
export default Admin;
