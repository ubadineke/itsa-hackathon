import mongoose, { model, Document, Schema } from 'mongoose';
import Staff from './staffModel';
import Organization from './orgModel';
import { IDevice } from '../interfaces';

const deviceSchema = new Schema<IDevice>(
    {
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Organization,
            requred: [true, 'organization info must be provided'],
        },
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Staff,
        },
        name: { type: String },
        setupId: { type: String, required: [true, 'provide setup id'] },
        system: { type: Object },
        osInfo: { type: Object },
        cpu: { type: Object },
        mem: { type: Object },
        battery: { type: Object },
        city: { type: String },
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

deviceSchema.index({ location: '2dsphere' });

const Device = model<IDevice>('Device', deviceSchema);
export default Device;
