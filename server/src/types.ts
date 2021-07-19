import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { Redis } from 'ioredis';
// & sign in typescript joins types together (intersection)
// | sign in typescript gives the option for the type to be either one type or another (union)

//performing an interesection so we can make req.session.userId 
//req.session.welcomeBackMsg and req.session.username available to be assigned
// new values on the req.session object
export type MyContext = {
    req: Request & {
        session: Session & Partial<SessionData> & {
            userId?: number
        } & { 
            welcomeBackMsg?: String 
        } & { 
            username?: String 
        }
    } & {
        user: JwtData | null
    }
    res: Response
    RedisClient?: Redis
}

/**
 * ansi escape code enum collection for printing any color text into the console as the first/third argument of a console.log()
 * @example 
 * console.log(`${red || "\x1b[31m"}`, "red text in the log", `${reset || "\x1b[00m"}`)
 */
 export enum ANSI_ESCAPES {
    red = "\x1b[31m",
    green = "\x1b[32m",
    blue = "\x1b[36m",
    yellow = "\x1b[33m",
    purple = "\x1b[35m",
    reset = "\x1b[00m"
}

export interface RegisterResponse {
    register: {
        errors: null | {
            field: string,
            message: string
        },
        token: string
        user: {
            email: string
        }
    }
}
export interface RegisterErrorResponse {
    register: {
        errors: [
            {
                field: string;
                message: string;
            }
        ];
        user: null; 
    }
}
export interface LoginResponse {
    login: {
        errors: null | [{
            field: string;
            message: string;
        }];
        user: null | {
            token: string;
            email: string;
            username: string;
        };
    }
}
export interface MeResponse {
    me: {
        email: string;
        username: string;
        token?: string;
    };
}
export interface LogoutResponse {
    logout: {
        errors: [{
            field: string;
            message: string;
        }] | null;
        user: {
            username: string;
            email: string;
            token: string;
        } | null;
    };
}

export type JwtData = IJwtData;

export interface IJwtData {
    username: string;
    id: number;
    email: string;
}