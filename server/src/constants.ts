require("dotenv").config();
import { RegisterResponse } from "./types";

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
export const REGISTER_EMAIL: string | undefined = TEST_EMAIL
export const REGISTER_USERNAME: string | undefined = TEST_USER
export const REGISTER_PASSWORD: string | undefined = TEST_PASS
export const REGISTER_MUTATION: string = `
mutation register {
  register(options: {
    email: "${REGISTER_EMAIL}",
    password: "${REGISTER_PASSWORD}",
    username: "${REGISTER_USERNAME}"
  }){
    user{
      email
    }
  }
}
`;
export const CORRECT_REGISTER_RESPONSE: RegisterResponse = {
  "register": {
    "user": {
      "email": `${REGISTER_EMAIL}`,
    },
  }
};