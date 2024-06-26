import mongoose, { model, Document, Schema } from 'mongoose';
import { IRequest } from '../interfaces';
import Staff from './staffModel';
import Technician from './technicianModel';
import Organization from './orgModel';

const requestSchema = new Schema<IRequest>(
    {
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Organization,
            required: [true, 'Please provide organization'],
        },
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Staff,
            required: [true, 'Please provide staff'],
        },
        device: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Please provide device'],
        },
        description: {
            type: String,
            required: [true, 'Please provide description'],
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            required: [true, 'Please state priority'],
        },
        technician: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Technician,
            required: [true, 'Please provide technician on the job'],
        },
        status: {
            type: String,
            enum: ['pending', 'ongoing', 'done'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

const Request = model<IRequest>('Request', requestSchema);
export default Request;
