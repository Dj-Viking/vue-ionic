import { User } from "src/entities/User";
import { ANSI_ESCAPES, MyContext } from "src/types";

import jwt from "jsonwebtoken";
require('dotenv').config();
const secret: string | undefined = process.env.SECRET;
const expiration: string | undefined = process.env.EXPIRATION;

export default {
  //every request coming in or out either get's signed or verified..
  //getting signed involves intersecting the express request with the user which personifies the jwt
  // and creating my own type of context to deal with my specific situation and how I prefer to handle auth i guess
  authMiddleware: function (
    context: MyContext
  ): MyContext["req"] {
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

      console.log(ANSI_ESCAPES.yellow, `token recieved ${token}`, ANSI_ESCAPES.reset)
      if (!token) {
        return context.req;
      }

      const jwtPayload = jwt.verify(token as string, 
                                    secret as string,
                                    { maxAge: expiration });//maxage deprecated but still accepted...
      context.req.user = jwtPayload;
    } catch {
      console.log('Invalid token');
      return context.req;
    }

    return context.req;
  },
  signToken: function ({ username, email, id }: User) {
    const payload = { username, email, id };

    return jwt.sign(
                    { data: payload },
                    secret as string,
                    { expiresIn: expiration });
  }
};