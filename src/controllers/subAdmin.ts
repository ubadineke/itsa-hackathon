import Organization from '../models/orgModel';
import Staff from '../models/staffModel';
import Request from '../models/requestModel';
import { Base } from '../interfaces';
import crypto from 'crypto';
import Device from '../models/deviceModel';
import EmailSender from '../utils/email';
import mongoose from 'mongoose';
const Email = new EmailSender();

export default class subAdmin {
    createStaff: Base = async (req, res, next) => {
        try {
            const { name, email } = req.body;
            if (!name || !email) return res.status(400).json('Provide staff email');

            //Random password
            const password = crypto.randomBytes(10).toString('hex').slice(0, 10);
            // const password = '123456789';
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
            const { user, email } = req.body;
            const randomString = crypto.randomBytes(10).toString('hex').slice(0, 10);
            if (user === 'staff') {
                const staff = await Staff.findOne({ email });
                if (!staff) return res.status(400).json('No staff with that email found');
                staff.requestToken = randomString;
                await staff.save();
            } else if (user === 'organization') {
                const organization = await Organization.findOne({ email: req.user.email });
                if (!organization)
                    return res.status(400).json('No organization with that email found');
                organization.requestToken = randomString;
                await organization.save();
            } else {
                return res.status(400).json('Provide correct user type ');
            }

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
            const { city, lon, lat, email, setupId, name, system, osInfo, mem, cpu, battery } =
                req.body;

            const staff = await Staff.findOne({ email: email });
            //if organization, send email and
            if (!staff) return res.status(400).json('Staff Record not found');
            const organization = await Organization.findOne({ _id: staff.organization });
            // if(){

            // }else(){

            // }
            const count = await Device.countDocuments({ staff: staff._id });
            let randomString = crypto.randomBytes(5).toString('hex').slice(0, 5);
            randomString = randomString.toUpperCase();
            const deviceName = `Device ${count + 1}${randomString}`;
            if (staff.requestToken !== setupId)
                return res.status(400).json('Setup id not correct or recorded');

            const location = { type: 'Point', coordinates: [lon, lat] };

            const device = await Device.create({
                organization,
                staff,
                setupId,
                name: deviceName,
                system,
                osInfo,
                cpu,
                mem,
                battery,
                city,
                location,
            });
            console.log(device);
            res.status(200).json({
                status: 'success',
                message: 'System information sent successfully',
                device,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json('Error occurred adding a device, try again!');
        }
    };

    getDeviceCount: Base = async (req, res, next) => {
        try {
            const devices = await Device.countDocuments({ organization: req.user._id });
            // const staffs = await Staff.find({ organization: req.user._id }).select('_id');
            // const staffIds = staffs.map((staff) => staff._id);

            // const devices = await Device.find({ staff: { $in: staffIds } });
            // const count = devices.length;

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
            const device = await Staff.findByIdAndDelete(id);
            if (!device) {
                return res.status(404).json('Device not found');
            }
            return res.status(204).send();
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
    // getAllDevices:Base = async(req, res)=> {

    // }
    getSingleDevice: Base = async (req, res, next) => {
        try {
            const { id } = req.params;
            const device = await Device.findById(id);
            if (!device) return res.status(404).json('No devices found');
            res.status(200).json({
                status: 'success',
                device,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };

    getDevices: Base = async (req, res) => {
        try {
            // const staffs = await Staff.find({ organization: req.user._id }).select('_id');
            // const staffIds = staffs.map((staff) => staff._id);

            // const devices = await Device.find({ staff: { $in: staffIds } });

            const devices = await Device.find({ organization: req.user._id });
            if (!devices) return res.status(400).json('No devices found');
            res.status(200).json({
                status: 'success',
                count: devices.length,
                devices,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };

    staffCount: Base = async (req, res) => {
        try {
            const staffs = await Staff.countDocuments({ organization: req.user._id });
            if (!staffs) return res.status(404).json('Staffs not found');
            res.status(200).json({
                status: 'success',
                staffs,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };

    ongoingMaintenance: Base = async (req, res) => {
        try {
            const devices = await Request.countDocuments({
                organization: req.user._id,
                status: 'ongoing',
            });
            if (!devices) return res.status(404).json('Devices not found');
            res.status(200).json({
                status: 'success',
                devices,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };

    getRequest: Base = async (req, res) => {
        try {
            const { _id } = req.user;
            const { status } = req.body;
            let requests;

            if (!status) {
                requests = await Request.find({ organization: _id }).sort({
                    updatedAt: -1,
                });
            }

            if (status) {
                requests = await Request.find({ organization: _id, status: status }).sort({
                    updatedAt: -1,
                });
            }

            if (!requests || requests.length === 0)
                return res.status(404).json('No requests found');

            res.status(200).json({
                status: 'success',
                requests,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };
}
