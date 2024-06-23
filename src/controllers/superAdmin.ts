import { Base } from '../interfaces';
import Organization from '../models/orgModel';
import Staff from '../models/staffModel';
import Technician from '../models/technicianModel';
import Geo from '../utils/geo';
export default class SuperAdminController {
    //create technician
    createTechnician: Base = async (req, res, next) => {
        try {
            const { name, email, phone, state, lga } = req.body;
            const coordinates = await Geo.getCoordinates(state, lga);

            const location = {
                type: 'Point',
                coordinates: [...coordinates],
            };
            const technician = await Technician.create({
                name,
                email,
                phone,
                state,
                lga,
                location,
            });
            console.log(technician);
            res.status(200).json({
                status: 'success',
                technician,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };

    organizations: Base = async (req, res, next) => {
        try {
            const organizations = await Organization.find();
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
            const { id } = req.params;
            const staffs = await Staff.find({ organization: id });
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
}
