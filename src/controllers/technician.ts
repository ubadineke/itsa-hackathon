import { Base } from '../interfaces';
import Request from '../models/requestModel';

export default class TechnicianController {
    getRequest: Base = async (req, res) => {
        try {
            const { _id } = req.user;
            const { status } = req.body;
            console.log(status);
            let requests;

            if (!status) {
                requests = await Request.find({ technician: _id });
            }

            if (status) {
                requests = await Request.find({ technician: _id, status: status });
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
            const { id, status } = req.body;
            if (!id || !status) return res.status(400).json('Provide id and/or status');
            const request = await Request.findByIdAndUpdate({ _id: id }, { status }, { new: true });
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

    ongoingRequest: Base = async (req, res) => {
        try {
            const { _id } = req.body;
            const requests = await Request.find({ technnician: _id, status: 'ongoing' });
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
}
