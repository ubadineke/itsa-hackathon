//create organization
//company name
//email
//phone
//password
import { model, Document, Schema } from 'mongoose';
import validator from 'validator';

export interface IOrganization extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
}

const OrganizationSchema = new Schema<IOrganization>(
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
    },
    { timestamps: true }
);

export const Organization = model<IOrganization>('Organization', OrganizationSchema);
