import { Base } from '../interfaces';
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
            res.status(400).json(err);
        }
    };
}
