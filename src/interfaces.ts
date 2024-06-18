import { Request, Response, NextFunction } from 'express';
export interface Base {
    (req: Request, res: Response, next: NextFunction): {};
}
