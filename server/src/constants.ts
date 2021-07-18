require("dotenv").config();
import { LogoutResponse, MeResponse } from "./types";

const {
  TEST_EMAIL,
  TEST_HOST,
  TEST_PASS,
  TEST_USER
} = process.env;

export const COOKIE_NAME: string = "sid";
export const IS_PROD: boolean | undefined = process.env.NODE_ENV === "production";
export const FORGET_PASS_PREFIX: string = "forget-password:";
export const HOST: string | undefined = TEST_HOST;
export const REGISTER_EMAIL: string | undefined = TEST_EMAIL;
export const REGISTER_USERNAME: string | undefined = TEST_USER;
export const REGISTER_PASSWORD: string | undefined = TEST_PASS;
export const UPDATED_USERNAME: string = `newUsername${Date.now()}`;

/**
 * query to check that when i log in that i can get my information from the db while logged in
 */
export const ME_QUERY: string = `
  query me {
    me {
      email
    }
  }
`;

/**
 * expect logout response to be true if it worked
 */
export const CORRECT_LOGOUT_RESPONSE: LogoutResponse = {
  logout: true
};
/**
 * expect to get whatever user data we want from the query for now just email on this constant
 */
export const CORRECT_ME_RESPONSE: MeResponse = {
  "me": {
    "email": `${REGISTER_EMAIL}`
  }
};

/**
 * string literal of the graphql mutation for the register action
 */
export const REGISTER_MUTATION: string = `
mutation register {
  register(options: {
    email: "${REGISTER_EMAIL}",
    password: "${REGISTER_PASSWORD}",
    username: "${REGISTER_USERNAME}"
  }){
    token
    errors {
      field
      message
    }
    user{
      email
    }
  }
}
`;
/**
 * string literal of the graphql mutation for the login action
 */
export const LOGOUT_MUTATION: string = `
mutation logout {
  logout
}`;
/**
 * string literal of the graphql mutation for the login action
 */
export const LOGIN_MUTATION: string = `
mutation login {
  login(options: {
    email: "${REGISTER_EMAIL}",
    password: "${REGISTER_PASSWORD}",
  }){
    errors {
      field
      message
    }
    token
    user {
      email
    }
  }
}`;