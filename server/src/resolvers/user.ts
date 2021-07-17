import { MyContext } from '../types';
import { User } from '../entities/User';
import { 
  Field, 
  InputType, 
  Resolver, 
  Arg, 
  Mutation, 
  Ctx, 
  ObjectType,
  Query 
} from 'type-graphql';
import { getConnection } from 'typeorm';
import argon2 from 'argon2';
import { FORGET_PASS_PREFIX } from '../constants';
import { sendEmail } from '../utils/sendEmail';
import { ErrorResponse } from '../utils/createError';
import { signToken } from '../utils/signToken';
const uuid = require('uuid');

@InputType()
class RegisterInput {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
}

@InputType()
class LoginInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
class UserFieldError {
  @Field()
  field: String;
  @Field()
  message: String; 
}

@ObjectType()
class ForgotPassError {
  @Field()
  field: String;
  @Field()
  message: String;
}
@ObjectType()
class ForgotPassResponse {
  @Field(() => [ForgotPassError], {nullable: true})
  errors?: ForgotPassError[]
  @Field(() => Boolean, {nullable: true})
  completed?: Boolean
}

//user returned if worked
// or error returned if error was there
@ObjectType()
class UserResponse {
  @Field(() => [UserFieldError], { nullable: true })
  errors?: UserFieldError[] | null

  @Field(() => User, { nullable: true })
  user?: User | null
  
  @Field(() => String, { nullable: true })
  token?: string | null
}

@Resolver()
export class UserResolver {

  @Mutation(() => ForgotPassResponse)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { RedisClient } : MyContext
  ): Promise<ForgotPassResponse>{
    try {
      const user = await User.findOne({ where: { email: email } })
      if (!user) {
        //email not in db
        // dont send the email
        const field = "Credentials";
        const message = "There was a problem with this request. Please try again later";
        return new ErrorResponse(field, message);
      }
      //if we actually matched a user 
      // the mutation will take some time
      // to execute
      const token = uuid.v4();
  
      //set the token with ioredis
      await RedisClient?.set(
        FORGET_PASS_PREFIX + token, //key
        user.id, //value type
        'ex', 
        1000 * 60 * 60 * 24 //token expires after 1 day
      );

  
      await sendEmail(email,
        `<a href="http://localhost:3000/change-password/${token}">Reset your password</a>`
      );
      return {
        completed: true
      }
    } catch (error) {
      console.log(error);
      const field = "Credentials";
      const message = "There was a problem with this request. Please try again later";
      return new ErrorResponse(field, message);
    }
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { RedisClient, req }: MyContext
  ): Promise<UserResponse>{

    try {
      if (newPassword.length <= 3) 
      {
        const field = "newPassword";
        const message = "New password length too short must be greater than 3 characters";
        return new ErrorResponse(field, message);
      }
  
      const key = FORGET_PASS_PREFIX + token;
      const userId = await RedisClient?.get(key)
      if (!userId) 
      {
        const field = "token";
        const message = "token expired";
        return new ErrorResponse(field, message);
      }
  
      const userIdFound = parseInt(userId);
      const user = await User.findOne(userIdFound);
      if (!user) 
      {
        const field =  "token";
        const message =  "token expired";
        return new ErrorResponse(field, message);
      }

      const hashedPassword = await argon2.hash(newPassword);
      await User.update(
        { id: userIdFound },
        { password: hashedPassword }
      );

      //delete the key so we can't change
      // the password again because the token
      // will be forcibly expired
      await RedisClient?.del(key)

      //log in user after password change
      req.session.userId = user.id;

      return {
        user
      }
    } catch (error) {
      console.log(error);
      const field =  "error";
      const message =  error;
      return new ErrorResponse(field, message);
    }
  }

  @Query(() => User, { nullable: true } )
  async me(
    @Ctx() context: MyContext
  ): Promise<User | null | ErrorResponse>{

    try {
      //check if user is logged in from the context.req.user
      if (!context.req.user) return null;
  
      const user = await User.findOne(context.req.user.data.id);
      if (!user) return null;
      return user;
      
    } catch (error) {
      return new ErrorResponse("error", error);
    }
  }

  /**
   *  @example
    mutation 
    {
        register(options: {
          email: "viking@viking.com"
          username: "viking",
          password: "viking"
        })
        {
          token
          errors {
            field
            message
          }
          user {
            email
            username
            id
            createdAt
            updatedAt
          }
        }
    }
    mutation register($options: UsernamePasswordInput!)
    {
        register(options: $options)
        {
          token
          errors {
            field
            message
          }
          user {
            username
            id
            createdAt
            updatedAt
          }
        }
    }
   */
  @Mutation(() => UserResponse)
  async register(
    @Arg('options', () => RegisterInput) options: RegisterInput,
    @Ctx() _context: MyContext
  ): Promise<UserResponse> {
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    try 
    {
      if (emailRegex.test(options.email) === false) 
      {
        const field = "Email";
        const message = "Email is not in correct format. Must be like example@mail.com";
        return new ErrorResponse(field, message);
      }
      if (options.username.length <= 2) 
      {
        const field =  "Username";
        const message = "username length too short must be greater than 2 characters";
        return new ErrorResponse(field, message);
      }
      if (options.password.length <= 3) 
      {
        const field = "Password";
        const message = "password length too short must be greater than 3 characters";
        return new ErrorResponse(field, message);
      }
  
      const hashedPassword = await argon2.hash(options.password);
      let user;
      const result = await getConnection().createQueryBuilder().insert().into(User).values(
        {
          username: options.username,
          email: options.email,
          password: hashedPassword
        }
      )
      .returning('*')
      .execute();
      //only returning the first user object in the array, 
      // i guess I could insert as many objects into the table and will
      // return more created objects into the raw array
      user = result.raw[0];

      //cookie method....not working in production for some reason....sets cookie locally but not in prod...frustrating
      //login the user after registration
      // req.session.userId = user.id;
      // req.session.username = user.username;
      
      const token = signToken(user);

      // req.user = token;
      //sign a token with the user information and then return it along with the user
      return {
        token,
        user
      };
    } catch (error) {
      if (error.code === '23505' || error.detail && error.detail.includes('already exists'))
      {
        const field = 'User';
        const message = "name and/or email is already taken!";
        return new ErrorResponse(field, message);
      } else {
        const field = 'Error';
        const message = error;
        return new ErrorResponse(field, message);
      }
    }
  }


  /**
   * @example
    mutation
    {
        login(options: {
          username: "username",
          password: "password"
        })
        {
          token
          errors {
            field
            message
          }
          user {
            id
            username
          }
        }
    }
    mutation login($options: UsernamePasswordInput)
    {
        login(options: $options)
        {
          token
          errors{
            field
            message
          }
          user{
            email
          }
        }
    }
   */
  @Mutation(() => UserResponse)
  async login(
    @Arg('options', () => LoginInput) options: LoginInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse>{
    const user = await User.findOne({ where: { email: options.email } });
    if (!user) 
    {
      const field = 'Credentials';
      const message = 'Incorrect Credentials';
      return new ErrorResponse(field, message);
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid)
    {
      const field = "Credentials";
      const message = "Incorrect Credentials";
      return new ErrorResponse(field, message);
    }
    //login the user, and set the cookie
    // req.session.userId = user.id;
    // req.session.welcomeBackMsg = `Welcome back ${user.username}!`;
    // req.session.username = user.username;

    const token = signToken(user);

    return {
      token,
      user
    };
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() context: MyContext
  ): Promise<boolean> | undefined {
    // return new Promise(resolve => req.session.destroy(error => {
    //   res.clearCookie(COOKIE_NAME);
    //   if (error) {
    //     console.log(error);
    //     return resolve(false);
    //   } else {
    //     return resolve(true);
    //   }
    // }));
    try {
      return new Promise(resolve => {
        context.req.user = null;
        resolve(true);
      })
    } catch (error) {
      console.log(error);
      return;
      
    }
  }

}