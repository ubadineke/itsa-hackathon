import Technician from '../models/technicianModel';
import Staff from '../models/staffModel';
import Device from '../models/deviceModel';

export default function getNearest(arr: []) {
    const location = Technician.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: arr,
                },
            },
        },
    }).limit(1);
    return location;
}
