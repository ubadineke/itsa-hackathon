import mongoose, { model, Document, Schema } from 'mongoose';
import { IRequest } from '../interfaces';
import Staff from './staffModel';
import Technician from './technicianModel';

const requestSchema = new Schema<IRequest>(
    {
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
        technician: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Technician,
            required: [true, 'Please provide technician on the job'],
        },
    },
    { timestamps: true }
);

const Request = model<IRequest>('Request', requestSchema);
export default Request;
