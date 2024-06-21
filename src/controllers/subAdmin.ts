import Organization from '../models/orgModel';
import Staff from '../models/staffModel';
import { Base } from '../interfaces';
import crypto from 'crypto';
import Device from '../models/deviceModel';

export default class subAdmin {
    createStaff: Base = async (req, res, next) => {
        try {
            const { name, email } = req.body;
            if (!name || !email) return res.status(400).json('Provide staff email');

            //Random password
            const password = crypto.randomBytes(10).toString('hex').slice(0, 10);
            // console.log(req.user);
            const staff = await Staff.create({
                organization: req.user._id,
                name,
                email,
                password,
            });

            res.status(200).json({
                status: 'success',
                logins: {
                    name,
                    email,
                    password,
                },
                //send mail to staff
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };

    newDeviceRequest: Base = async (req, res, next) => {
        try {
            const randomString = crypto.randomBytes(6).toString('hex').slice(0, 6);
            await Staff.findOneAndUpdate(
                { email: req.body.email },
                { requestToken: randomString },
                { new: true }
            );
            res.status(200).json({
                status: 'success',
                setupId: randomString,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };

    collectInfo: Base = async (req, res, next) => {
        try {
            const { email, setupId, name, system, osInfo, mem, cpu, battery } = req.body;
            console.log(email, setupId);

            const staff = await Staff.findOne({ email: email });
            if (!staff) return res.status(400).json('Staff Record not found');
            if (staff.requestToken !== setupId)
                return res.status(400).json('Setup id not correct or not recorded');

            const device = await Device.create({ staff, name, system, osInfo, cpu, mem, battery });
            res.status(200).json({
                status: 'success',
                device,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };

    getAllDevices: Base = async (req, res, next) => {
        const devices = await Device.countDocuments();
        res.status(200).json({
            status: 'success',
            devices,
        });
    };
}
