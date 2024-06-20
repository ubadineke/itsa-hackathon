import Staff from '../models/staffModel';
import { Base } from '../interfaces';
import crypto from 'crypto';

export default class StaffController {
    newDeviceRequest: Base = async (req, res, next) => {
        const randomString = crypto.randomBytes(6).toString('hex').slice(0, 6);
        const token = await Staff.findByIdAndUpdate(
            req.user._id,
            { requestToken: randomString },
            { new: true }
        );
        res.status(200).json({
            status: 'success',
            setupId: randomString,
        });
    };

    collectInfo: Base = async (req, res, next) => {
        const { email, setupId } = req.body;
        console.log(email, setupId);
        const staff = await Staff.findOne({ email });
        if (!staff) return res.status(400).json('Staff Record not found');
        if (staff.requestToken !== setupId)
            return res.status(400).json('Setup id not correct or not recorded');

        console.log(req.body);
    };
}
