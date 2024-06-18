import { Request, Response, NextFunction } from 'express';
import Organization from '../models/orgModel';
import Staff from '../models/orgModel';
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
        const hashedPassword = await bcrypt.hash(password, 8);
        // const staff = await Staff.
        // console.log(password, hashedPassword);

        //email
        //simulate login to hash
        //return the details
    };
}
