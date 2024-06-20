import { Request, Response, NextFunction } from 'express';
import Organization from '../models/orgModel';
import Staff from '../models/staffModel';
import { Base, IOrganization } from '../interfaces';
import jwt, { JwtPayload } from 'jsonwebtoken';
import JwtFunction from '../utils/jwtToken';
import { promisify } from 'util';
import Config from '../config';
import { verify } from 'crypto';

const Jwt = new JwtFunction();

export default class AuthController {
    private role: string | undefined;

    public signup: Base = async (req, res, next) => {
        const { name, email, phone, password } = req.body;
        const organization = await Organization.create({ name, email, phone, password });

        Jwt.createAndSend(organization, 201, res);
    };

    public login: Base = async (req, res, next) => {
        const { email, password, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email and password',
            });
        }

        let user: IOrganization | null = null;

        if (role === 'sub-admin') {
            user = await Organization.findOne({ email: email }).select('+password');
        } else if (role === 'staff') {
            user = await Staff.findOne({ email }).select('+password');
        }

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect email or password',
            });
        }

        if (user.role !== role) {
            return res.status(400).json({
                status: 'fail',
                message: `No ${role} record found`,
            });
        }

        Jwt.createAndSend(user, 200, res);
    };

    public protect = (role: string) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            this.role = role;
            // console.log(this.role);
            let token;
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
            }

            if (!token) {
                return res.status(401).json('You are not logged in. Please log in to gain access!');
                // return next(new AppError('You are not logged in. Please log in to gain access!', 401));
            }

            //2) Verifying token
            const verifyJwt = promisify(jwt.verify) as (
                token: string,
                secretOrPublicKey: jwt.Secret,
                options?: jwt.VerifyOptions
            ) => Promise<JwtPayload>;

            const decoded: any = await verifyJwt(token, Config.JWT_SECRET).catch((err) => {
                return res.status(401).json('Invalid token, Please log in again!');
                // return next(new AppError('Invalid token, Please log in again!', 401));
            });

            // //3) Check if user still exists
            let currentUser;

            if (this.role === 'sub-admin') {
                currentUser = await Organization.findById(decoded.id);
            } else if (this.role === 'staff') {
                currentUser = await Staff.findById(decoded.id);
            } else {
                console.log('check');
                return res.status(400).json('Provide the accepted user types');
            }
            if (!currentUser) {
                return res.status(401).json('The user belonging to this token does not exist');
                //     // return next(new AppError('The user belonging to this token does not exist', 401));
            }
            // // //store user details
            req.user = currentUser;
            next();
        };
    };
}
