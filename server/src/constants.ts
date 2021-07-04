import { RegisterResponse } from "./types";

export const COOKIE_NAME: string = "sid";
export const IS_PROD: boolean | undefined = process.env.NODE_ENV === "production";
export const FORGET_PASS_PREFIX: string = "forget-password:";
export const HOST: string = "http://localhost:4000";
export const REGISTER_EMAIL: string = "viking@viking.com"
export const REGISTER_USERNAME: string = "viking"
export const REGISTER_PASSWORD: string = "viking"
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