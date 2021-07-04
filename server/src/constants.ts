export const COOKIE_NAME = "sid";
export const IS_PROD = process.env.NODE_ENV === "production";
export const FORGET_PASS_PREFIX = "forget-password:";
export const HOST = "http://localhost:4000";
export const REGISTER_EMAIL = "viking@viking.com"
export const REGISTER_USERNAME = "viking"
export const REGISTER_PASSWORD = "viking"
export const REGISTER_MUTATION = `
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
export const CORRECT_REGISTER_RESPONSE = {
  "register": {
    "user": {
      "email": `${REGISTER_EMAIL}`,
    },
  }
};