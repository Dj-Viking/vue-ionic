import { request } from "graphql-request";
import { User } from "../entities/User";
// import { User } from "../entities/User";
import { 
  CORRECT_LOGIN_RESPONSE, 
  CORRECT_LOGOUT_RESPONSE, 
  CORRECT_ME_RESPONSE, 
  CORRECT_REGISTER_RESPONSE, 
  HOST, 
  LOGIN_MUTATION, 
  LOGOUT_MUTATION, 
  ME_QUERY, 
  REGISTER_EMAIL, 
  REGISTER_MUTATION 
} from "../constants";
import { connectDb } from "./utils/connectDb";
import { ANSI_ESCAPES } from "../types";
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
    const res = await request(HOST + "/graphql", REGISTER_MUTATION);
    logJson(res);
    expect(res).toEqual(CORRECT_REGISTER_RESPONSE);
  });
  
  it("and check that the user got added to the db", async () => {
    console.log(`${ANSI_ESCAPES.blue}`, `checking that the user got added to the DB`, `${ANSI_ESCAPES.reset}`);
    const connection = await connectDb();
    const users = await User.find({ where: { email: REGISTER_EMAIL }});
    console.log("users");
    logJson(users);
    expect(users).toHaveLength(1);
    connection.close();
  });

});
// launch login mutation
describe("do the login mutation", () => {
  it("login mutation", async () => {
    const res = await request(HOST + "/graphql", LOGIN_MUTATION);
    // check the response
    expect(res).toEqual(CORRECT_LOGIN_RESPONSE);
  }); 
});

// do a me query
describe("do a me query to check that I am logged in", () => {
  it("me query", async () => {
    const res = await request(HOST + "/graphql", ME_QUERY);
    expect(res).toEqual(CORRECT_ME_RESPONSE);
  });
});

//logout 
describe("do the logout mutation", () => {
  it("logs out", async () => {
    const res = await request(HOST + "/graphql", LOGOUT_MUTATION);
    expect(res).toEqual(CORRECT_LOGOUT_RESPONSE);
  });
});


//delete the user
it("checks if we delete the user we just made", async () => {
  const connection = await connectDb();
  await User.delete({ email: REGISTER_EMAIL });
  const users = await User.find({ where: { email: REGISTER_EMAIL } });
  expect(users).toHaveLength(0);
  connection.close();
}); 
