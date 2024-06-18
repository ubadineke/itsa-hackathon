import mongoose, { model, Document, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { IStaff } from '../interfaces';
import Organization from './orgModel';
const staffSchema = new Schema<IStaff>(
    {
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Organization,
            required: true,
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
            enum: ['staff'],
            default: 'staff',
        },
    },
    { timestamps: true }
);

staffSchema.pre<IStaff>('save', async function (next) {
    //ONly run this function if password was actually modified
    if (!this.isModified('password')) return next();

    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 8);

    next();
});

staffSchema.methods.correctPassword = async function (
    incomingPassword: string,
    storedPassword: string
) {
    return await bcrypt.compare(incomingPassword, storedPassword);
};

const Staff = model<IStaff>('Staff', staffSchema);

export default Staff;
