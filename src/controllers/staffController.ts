import Staff from '../models/staffModel';
import Device from '../models/deviceModel';
import { Base, IDevice, ITechnician } from '../interfaces';
import Request from '../models/requestModel';
import Technician from '../models/technicianModel';
import EmailSender from '../utils/email';
import crypto from 'crypto';
import getNearest from '../utils/getNearest';

export default class StaffController {
    deviceCount: Base = async (req, res, next) => {
        try {
            const devices = await Device.countDocuments({ staff: req.user._id });
            res.status(200).json({
                status: 'success',
                devices,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: 'success',
                err,
            });
        }
    };

    listDevices: Base = async (req, res, next) => {
        try {
            const devices = await Device.find({ staff: req.user._id });
            if (!devices) return res.status(404).json('No devices attached to this user yet');
            res.status(200).json({
                status: 'success',
                devices,
            });
        } catch (err) {}
    };

    getSingleDevice: Base = async (req, res) => {
        try {
            const { id } = req.params;
            const device = await Device.findById({ _id: id });
            if (!device) return res.status(404).json('No device recorded');
            res.status(200).json({
                status: 'success',
                device,
            });
        } catch (err) {}
    };
    makeMaintenanceRequest: Base = async (req, res) => {
        try {
            const { id, priority, description } = req.body;
            const device = await Device.findById(id);
            if (!device) return res.status(400).json('Device not found');

            const coordinates = device?.location.coordinates;
            const technician = await getNearest(coordinates);

            if (!technician[0]) return res.status(400).json('No technicians found');

            const sendEmail = new EmailSender();

            const request = await Request.create({
                staff: req.user,
                device,
                description,
                priority,
                technician: technician[0]._id,
            });
            await sendEmail
                .send({
                    email: technician[0]?.email,
                    subject: 'Maintenance Request',
                    message: description,
                })
                .catch((err) => console.log(err));

            res.status(200).json({
                status: 'success',
                request,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };
}
