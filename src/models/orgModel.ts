//create organization
//company name
//email
//phone
//password
import mongoose, { model, Document, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { ObjectId } from '../types';

export interface IOrganization extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
}

// console.log(IOrganization);

const organizationSchema = new Schema<IOrganization>(
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
            required: true,
            enum: ['sub-admin'],
            default: 'sub-admin',
        },
    },
    { timestamps: true }
);

organizationSchema.pre<IOrganization>('save', async function (next) {
    //ONly run this function if password was actually modified
    if (!this.isModified('password')) return next();

    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 8);

    next();
});

export const Organization = model<IOrganization>('Organization', organizationSchema);
