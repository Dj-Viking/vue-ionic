import { request } from "graphql-request";
import { User } from "../entities/User";
import { 
  CORRECT_REGISTER_ERROR,
  HOST, 
  // CORRECT_REGISTER_ERROR, 
} from "../constants";
import { connectDb } from "./utils/connectDb";
import {
  REGISTER_MUTATION, 
  CORRECT_REGISTER_RESPONSE,
  REGISTER_EMAIL,
} from "../../src/constants";
import { ANSI_ESCAPES } from "../types";
import { logJson } from "../__tests__/utils/helpers";

describe("Tests the user register", () => {
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
    logJson(users);
    expect(users).toHaveLength(1);
    connection.close();
  });

  it("checks if we try to register with the same credentials it returns the correct error response", async () => {
    console.log(`${ANSI_ESCAPES.blue}`, `trying to register the same user`, `${ANSI_ESCAPES.reset}`);
    const res = await request(HOST + "/graphql", REGISTER_MUTATION);
    logJson(res);
    expect(res).toEqual(CORRECT_REGISTER_ERROR);
  });

  it("checks if we delete the user we just made", async () => {
    console.log(`${ANSI_ESCAPES.blue}`, `deleting a user`, `${ANSI_ESCAPES.reset}`);
    
    const connection = await connectDb();
    await User.delete({ email: REGISTER_EMAIL });
    const users = await User.find({ where: { email: REGISTER_EMAIL } });
    logJson(users);
    expect(users).toHaveLength(0);
    connection.close();
  }); 
});