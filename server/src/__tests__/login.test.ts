import { request } from "graphql-request";
import { User } from "../entities/User";
import { 
  HOST, 
  LOGIN_MUTATION,  
  // ME_QUERY,  
  REGISTER_EMAIL, 
  REGISTER_MUTATION, 
  REGISTER_USERNAME
} from "../constants";
import { connectDb } from "./utils/connectDb";
import { ANSI_ESCAPES, LoginResponse, RegisterResponse } from "../types";
import { logJson } from "./utils/helpers";
// import { connectDb } from "./utils/connectDb";

describe("log a cookie", () => {
  it("logs", () => {
    console.log(`${ANSI_ESCAPES.blue}`, `logging a cookie`, `${ANSI_ESCAPES.reset}`);
    let cookie = Buffer.from(JSON.stringify({"count": 2})).toString('base64');
    logJson(cookie);
  });
});

describe("register first and then use the same credentials to test login mutation", () => {
  it("get expected response from the register mutation", async () => {
    console.log(`${ANSI_ESCAPES.blue}`, `Registering a new user`, `${ANSI_ESCAPES.reset}`);
    const res: RegisterResponse = await request(HOST + "/graphql", REGISTER_MUTATION);
    logJson(res);
    expect(res.register.token).toBeTruthy();
    expect(res.register.errors).toBeNull();
    expect(res.register.user.email).toEqual(REGISTER_EMAIL);
  });
  
  it("and check that the user got added to the db", async () => {
    console.log(`${ANSI_ESCAPES.blue}`, `checking that the user got added to the DB`, `${ANSI_ESCAPES.reset}`);
    const connection = await connectDb();
    const users = await User.find({ where: { email: REGISTER_EMAIL }});
    logJson(users);
    expect(users).toHaveLength(1);
    connection.close();
  });

});
// launch login mutation
describe("do the login mutation", () => {
  it("login mutation", async () => {
    console.log(`${ANSI_ESCAPES.blue}`, `check the login mutation`, `${ANSI_ESCAPES.reset}`);
    const res: LoginResponse = await request(HOST + "/graphql", LOGIN_MUTATION);
    // check the response
    logJson(res);
    expect(res.login.errors).toBeNull();
    expect(res.login.user?.token).toBeTruthy();
    expect(res.login.user?.email).toEqual(REGISTER_EMAIL);
    expect(res.login.user?.username).toEqual(REGISTER_USERNAME);
  }); 
});

// do a me query
//not sure how to test this yet
// describe("do a me query to check that I am logged in", () => {
//   it("me query", async () => {
//     console.log(`${ANSI_ESCAPES.blue}`, `check the me query`, `${ANSI_ESCAPES.reset}`);
//     const res = await request(HOST + "/graphql", ME_QUERY);
//     logJson(res);
//   });
// }); 

describe("delete the user we just made", () => {
  //delete the user
  it("checks if we delete the user we just made", async () => {
    console.log(`${ANSI_ESCAPES.blue}`, `checks the delete action`, `${ANSI_ESCAPES.reset}`);
    const connection = await connectDb();
    await User.delete({ email: REGISTER_EMAIL });
    const users = await User.find({ where: { email: REGISTER_EMAIL } });
    expect(users).toHaveLength(0);
    connection.close();
  }); 
})
