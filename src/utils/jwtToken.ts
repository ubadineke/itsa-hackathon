import jwt from 'jsonwebtoken';
import { Response } from 'express';
import config from '../config';
import { ObjectId } from '../types';
import { IOrganization } from '../models/orgModel';

export default class Jwt {
    public create(id: ObjectId) {
        return jwt.sign({ id }, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRES_IN,
        });
    }

    public createAndSend(user: IOrganization, statusCode: number, res: Response) {
        const token = this.create(user._id);
        user.password = '';
        res.status(statusCode).json({
            status: 'success',
            token,
            user,
        });
    }
}
