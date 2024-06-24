import Staff from '../models/staffModel';
import Device from '../models/deviceModel';
import { Base, ITechnician } from '../interfaces';
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
        const devices = await Device.find({ staff: req.user._id });
        if (!devices) return res.status(404).json('No devices attached to this user yet');
        res.status(200).json({
            status: 'success',
            devices,
        });
    };

    getSingleDevice: Base = async (req, res) => {
        const { id } = req.params;
        const device = await Device.findById({ _id: id });
        if (!device) return res.status(404).json('No device recorded');
        res.status(200).json({
            status: 'success',
            device,
        });
    };
    makeMaintenanceRequest: Base = async (req, res) => {
        const { id } = req.params;
        const device = await Device.findById(id);
        if (!device) return res.status(400).json('Device not found');
        // return console.log(device);
        const coordinates = device.location.coordinates;
        const location = await getNearest(coordinates);
        return console.log(location);

        const sendEmail = new EmailSender();
        //     const {id, description} = req.body
        //     //staff wey get am
        //     const technician = await Technician.findById(id);
        //     const request = await Request.create({staff: req.user._id, device: id, description, technician })
        // await sendEmail.sendEmail({
        //     email: technician.email,
        //     subject: 'Maintenance Request',
        //     message,
        // }).catch(async (err) => {
        // });
        // staff, device, description, technician
        //device id
        //note
        //store and send to the closest techincian email
    };
}
