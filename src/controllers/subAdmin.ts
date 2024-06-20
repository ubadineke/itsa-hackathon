import { Request, Response, NextFunction } from 'express';
import Organization from '../models/orgModel';
import Staff from '../models/staffModel';
import { Base, IOrganization } from '../interfaces';
import JwtFunction from '../utils/jwtToken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export default class subAdmin {
    createStaff: Base = async (req, res, next) => {
        const { email } = req.body;
        if (!email) return res.status(400).json('Provide staff email');

        //Random password
        const password = crypto.randomBytes(10).toString('hex').slice(0, 10);
        // console.log(req.user);
        const staff = await Staff.create({
            organization: req.user._id,
            email,
            password,
        });

        res.status(200).json({
            status: 'success',
            logins: {
                email,
                password,
            },
        });
        //send mail to staff
    };

    collectInfo: Base = async (req, res, next) => {
        console.log(req.body);
    };
}
