import jwt from 'jsonwebtoken';
import { Response } from 'express';
import config from '../config';
import { ObjectId } from '../types';
import { IAdmin, IOrganization } from '../interfaces';

export default class Jwt {
    public create(id: ObjectId) {
        return jwt.sign({ id }, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRES_IN,
        });
    }

    public createAndSend(user: IOrganization | IAdmin, statusCode: number, res: Response) {
        const token = this.create(user._id);
        user.password = '';
        res.status(statusCode).json({
            status: 'success',
            token,
            user,
        });
    }
}
