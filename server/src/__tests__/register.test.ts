import { request } from "graphql-request";
import { User } from "../entities/User";
import { 
  HOST, 
} from "../constants";
import { connectDb } from "./utils/connectDb";
import {
  REGISTER_MUTATION, 
  REGISTER_EMAIL,
} from "../../src/constants";
import { ANSI_ESCAPES, RegisterResponse } from "../types";
import { logJson } from "../__tests__/utils/helpers";

describe("Tests the user register", () => {
  it("get expected response from the register mutation", async () => {

    console.log(`${ANSI_ESCAPES.blue}`, `Registering a new user`, `${ANSI_ESCAPES.reset}`);
    const res: RegisterResponse = await request(HOST + "/graphql", REGISTER_MUTATION);
    logJson(res);
    console.log('user', res);
    
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

  it("checks if we try to register with the same credentials it returns an error", async () => {
    console.log(`${ANSI_ESCAPES.blue}`, `trying to register the same user`, `${ANSI_ESCAPES.reset}`);
    const res: RegisterResponse = await request(HOST + "/graphql", REGISTER_MUTATION);
    logJson(res);
    expect(res.register.errors).toHaveLength(1);
  });

  it("checks if we delete the user we just made", async () => {
    const connection = await connectDb();
    await User.delete({ email: REGISTER_EMAIL });
    const users = await User.find({ where: { email: REGISTER_EMAIL } });
    console.log(`${ANSI_ESCAPES.blue}`, `deleting a user ${users}`, `${ANSI_ESCAPES.reset}`);
    logJson(users);
    expect(users).toHaveLength(0);
    connection.close();
  }); 
});