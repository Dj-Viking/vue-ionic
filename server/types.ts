import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { Redis } from 'ioredis';
// & sign in typescript joins types together (intersection)
// | sign in typescript gives the option for the type to be either one type or another (union)

export type MyContext = {
    //performing an interesection so we can make req.session.userId 
    //req.session.welcomeBackMsg and req.session.username available to be assigned
    // new values on the req.session object
    req: Request & {
        session: Session & Partial<SessionData> & {
            userId?: number
        } & { 
            welcomeBackMsg?: String 
        } & { 
            username?: String 
        }
    }
    res: Response
    RedisClient: Redis
}