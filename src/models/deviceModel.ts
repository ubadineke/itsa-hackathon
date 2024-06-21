import mongoose, { model, Document, Schema } from 'mongoose';
import Staff from './staffModel';
import { IDevice } from '../interfaces';

const deviceSchema = new Schema<IDevice>(
    {
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Staff,
            requred: [true, 'staff info must be provided'],
        },
        name: { type: String },
        system: { type: Object },
        osInfo: { type: Object },
        cpu: { type: Object },
        mem: { type: Object },
        battery: { type: Object },
    },
    { timestamps: true }
);

const Device = model<IDevice>('Device', deviceSchema);
export default Device;
