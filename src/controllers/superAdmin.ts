import { Base } from '../interfaces';
import Technician from '../models/technicianModel';
export default class SuperAdminController {
    //create technician
    createTechnician: Base = async (req, res, next) => {
        try {
            const { name, email, phone, state, lga } = req.body;
            const technician = await Technician.create({ name, email, phone, state, lga });
            res.status(200).json({
                status: 'success',
                technician,
            });
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    };
}
