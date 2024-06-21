import { Base } from '../interfaces';
import Technician from '../models/technicianModel';
export default class SuperAdminController {
    //create technician
    createTechnician: Base = async (req, res, next) => {
        try {
            const { name, email, location } = req.body;
            const technician = await Technician.create({});
        } catch (err) {
            console.log(err);
            res.status(400).json({});
        }
    };
}
