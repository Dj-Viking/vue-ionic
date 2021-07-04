import { request } from "graphql-request";
import { User } from "../entities/User";
import { HOST } from "../constants";
import { connectDb } from "./utils/connectDb";
import {
  REGISTER_MUTATION, 
  CORRECT_REGISTER_RESPONSE,
  REGISTER_EMAIL,
} from "../../src/constants";

describe("Tests the user register", () => {
  it("get expected response from the register mutation", async () => {
    const res = await request(HOST + "/graphql", REGISTER_MUTATION);
    expect(res).toEqual(CORRECT_REGISTER_RESPONSE);
  });
  
  it("and check that the user got added to the db", async () => {
    const connection = await connectDb();
    const users = await User.find({ where: { email: REGISTER_EMAIL }});
    expect(users).toHaveLength(1);
    connection.close();
  });

  it("checks if we delete the user we just made", async () => {
    const connection = await connectDb();
    await User.delete({ email: REGISTER_EMAIL });
    const users = await User.find({ where: { email: REGISTER_EMAIL } });
    expect(users).toHaveLength(0);
    connection.close();
  }); 
});