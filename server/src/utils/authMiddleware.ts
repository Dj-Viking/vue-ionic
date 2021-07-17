import { JwtData, MyContext } from "../types";
import jwt, { JwtPayload } from "jsonwebtoken";
require('dotenv').config();
const secret: string | undefined = process.env.SECRET;
const expiration: string | undefined = process.env.EXPIRATION;


export function authMiddleware(
  context: MyContext
): MyContext {
  
  try {
    // allows token to be sent via req.body, req.query, or headers
    let token = context.req.headers.authorization;

    // ["Bearer", "<tokenvalue>"] 
    //received by apollo server and the login mutation
    if (context.req.headers.authorization) {
      //token = Bearer `${token}`<- getting this token part from the context request headers
      // and remove any white space before or after the token string if any
      token = token?.split(' ')?.pop()?.trim();
    }

    // console.log(ANSI_ESCAPES.yellow, `token recieved ${token}`, ANSI_ESCAPES.reset);
    if (!token) {
      return context;
    }

    const jwtPayload: JwtPayload | string = jwt.verify(token as string,
                                                  secret as string,
                                                  { maxAge: expiration }); //maxage deprecated but still accepted...
    // console.log('payload', jwtPayload);
    
    context.req.user = <JwtData>jwtPayload;
  } catch (error) {
    console.log(error);
    return context
  }

  return context;
}