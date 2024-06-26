import { Base } from '../interfaces';
import Request from '../models/requestModel';
import Technician from '../models/technicianModel';

export default class TechnicianController {
    getRequest: Base = async (req, res) => {
        try {
            const { _id } = req.user;
            const { status } = req.body;
            console.log(status);
            let requests;

            if (!status) {
                requests = await Request.find({ technician: _id }).sort({
                    createdAt: 1,
                });
            }

            if (status) {
                requests = await Request.find({ technician: _id, status: status }).sort({
                    createdAt: 1,
                });
            }

            if (!requests) return res.status(404).json('No requests found');

            res.status(200).json({
                status: 'success',
                requests,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    };
    updateRequest: Base = async (req, res) => {
        try {
            const { id, choice } = req.body;
            if (!id || !choice) return res.status(400).json('Provide id and/or status');
            let request;
            if (choice === 'accept') {
                request = await Request.findByIdAndUpdate(
                    { _id: id },
                    { status: 'ongoing' },
                    { new: true }
                );
            } else if (choice === 'finish') {
                request = await Request.findByIdAndUpdate(
                    { _id: id },
                    { status: 'done' },
                    { new: true }
                );
            } else {
                return res.status(400).json('Provide correct choice type');
            }

            if (!request) return res.status(404).json('No request found');
            res.status(200).json({
                status: 'success',
                request,
            });
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
            const { name } = req.body;

            const profile = await Technician.findByIdAndUpdate(_id, { name }, { new: true });
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
