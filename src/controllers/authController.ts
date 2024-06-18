import { Request, Response, NextFunction } from 'express';
import { Organization } from '../models/orgModel';
import JwtFunction from '../utils/jwtToken';

const Jwt = new JwtFunction();
interface Base {
    (req: Request, res: Response, next: NextFunction): {};
    // (req: Request, res: Response, next: NextFunction): Status;
}

export class AuthController {
    // private req: Request;
    // private res: Response;
    // private next: NextFunction;
    // private static readonly seed = 10;

    // constructor(req: Request, res: Response, next: NextFunction) {
    //     this.req = req;
    //     this.res = res;
    //     this.next = next;
    // }

    public signup: Base = async (req, res, next) => {
        const { name, email, phone, password } = req.body;
        const organization = await Organization.create({ name, email, phone, password });

        Jwt.createAndSend(organization, 201, res);

        // return res.status(200).json({
        //     status: 'success',
        //     organization,
        // });
    };
}
