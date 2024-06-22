import Organization from '../models/orgModel';
import Staff from '../models/staffModel';
import { Base } from '../interfaces';
import crypto from 'crypto';
import Device from '../models/deviceModel';
import EmailSender from '../utils/email';

const Email = new EmailSender();

export default class subAdmin {
    createStaff: Base = async (req, res, next) => {
        try {
            const { name, email } = req.body;
            if (!name || !email) return res.status(400).json('Provide staff email');

            //Random password
            const password = crypto.randomBytes(10).toString('hex').slice(0, 10);
            const staff = await Staff.create({
                organization: req.user._id,
                name,
                email,
                password,
            });
            const message = `email: ${email} \n password: ${password}`;
            await Email.send({
                email,
                subject: 'Your login credentials for the ITSA Dashboard',
                message,
            });
            res.status(200).json({
                status: 'success',
                logins: {
                    name,
                    email,
                    password,
                },
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };

    newDeviceRequest: Base = async (req, res, next) => {
        try {
            const randomString = crypto.randomBytes(10).toString('hex').slice(0, 10);
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

            const device = await Device.create({
                staff,
                setupId,
                name,
                system,
                osInfo,
                cpu,
                mem,
                battery,
            });
            console.log(device);
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
        try {
            const devices = await Device.countDocuments();
            res.status(200).json({
                status: 'success',
                devices,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };

    setupStatus: Base = async (req, res, next) => {
        try {
            const { setupId } = req.params;
            const { _id } = req.user;
            const device = await Device.findOne({ setupId });
            if (!device) return res.status(404).json('Not found');
            res.status(200).json({
                status: 'success',
                device,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };

    getAllStaffs: Base = async (req, res) => {
        try {
            const staffs = await Staff.find({ organization: req.user._id });
            if (!staffs) return res.status(404).json('No staffs recorded');
            res.status(200).json({
                status: 'success',
                count: staffs.length,
                staffs,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };

    deleteStaff: Base = async (req, res) => {
        try {
            const { id } = req.params;
            await Staff.findByIdAndDelete(id);
            res.status(204).send;
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };
    getProfile: Base = async (req, res) => {
        try {
            const profile = req.user;
            res.status(200).json({
                status: 'success',
                profile,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };

    updateProfile: Base = async (req, res) => {
        try {
            const { _id } = req.user;
            const { name, phone } = req.body;

            const profile = await Organization.findByIdAndUpdate(
                _id,
                { name, phone },
                { new: true }
            );
            res.status(200).json({
                status: 'success',
                profile,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };
}
