import { Base } from '../interfaces';
import Organization from '../models/orgModel';
import Staff from '../models/staffModel';
import Technician from '../models/technicianModel';
import Device from '../models/deviceModel';
import Geo from '../utils/geo';
import randomString from '../utils/randomString';
import Request from '../models/requestModel';

export default class SuperAdminController {
    //create technician
    createTechnician: Base = async (req, res, next) => {
        try {
            const { name, email, phone, state, lga } = req.body;
            const password = randomString(10);

            const coordinates = await Geo.getCoordinates(state, lga);

            const location = {
                type: 'Point',
                coordinates: [...coordinates],
            };

            const technician = await Technician.create({
                name,
                email,
                password,
                phone,
                state,
                lga,
                location,
            });

            res.status(200).json({
                status: 'success',
                email,
                password,
                technician,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };

    organizations: Base = async (req, res, next) => {
        try {
            const { count } = req.query;
            let organizations;
            if (count === 'yes') {
                organizations = await Organization.countDocuments();
            } else {
                organizations = await Organization.find();
            }
            if (!organizations) return res.status(404).json('No organizations found');
            res.status(200).json({
                status: 'success',
                organizations,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };

    staffs: Base = async (req, res) => {
        try {
            const { count } = req.query;
            let staffs;
            if (count === 'yes') {
                staffs = await Staff.countDocuments();
            } else {
                staffs = await Staff.find();
            }
            if (!staffs) return res.status(404).json('No staffs found');
            res.status(200).json({
                status: 'success',
                staffs,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };

    technicians: Base = async (req, res) => {
        try {
            const { count } = req.query;
            let technicians;
            if (count === 'yes') {
                technicians = await Technician.countDocuments();
            } else {
                technicians = await Technician.find().select('-location');
            }
            if (!technicians) return res.status(404).json('Technicians not found');
            res.status(200).json({
                status: 'success',
                technicians,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };

    devices: Base = async (req, res) => {
        try {
            const { count } = req.query;
            let devices;
            if (count === 'yes') {
                devices = await Device.countDocuments();
            } else {
                devices = await Device.find().select('-location');
            }
            if (!devices) return res.status(404).json('Device not found');
            res.status(200).json({
                status: 'success',
                devices,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };

    requests: Base = async (req, res) => {
        try {
            const { count } = req.query;
            let requests;
            if (count === 'yes') {
                requests = await Request.countDocuments();
            } else {
                requests = await Request.find();
            }
            if (!requests) return res.status(404).json('Requests not found');
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
