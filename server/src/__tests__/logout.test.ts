import { request } from "graphql-request";
import { User } from "../entities/User";
import { HOST, LOGOUT_MUTATION, REGISTER_EMAIL, REGISTER_MUTATION, REGISTER_USERNAME } from "../constants";
import { ANSI_ESCAPES, LogoutResponse, RegisterResponse } from "../types";
import { connectDb } from "./utils/connectDb";
import { logJson } from "./utils/helpers";

describe("Tests the user register", () => {
  it("get expected response from the register mutation", async () => {
    console.log(`${ANSI_ESCAPES.blue}`, `Registering a new user`, `${ANSI_ESCAPES.reset}`);
    const res: RegisterResponse = await request(HOST + "/graphql", REGISTER_MUTATION);
    console.log('user', logJson(res));
    expect(res.register.token).toBeTruthy();
    expect(res.register.errors).toBeNull();
    expect(res.register.user.email).toEqual(REGISTER_EMAIL);
  });

  it("checks if we try to register with the same credentials it returns an error", async () => {
    console.log(`${ANSI_ESCAPES.blue}`, `trying to register the same user`, `${ANSI_ESCAPES.reset}`);
    const res: RegisterResponse = await request(HOST + "/graphql", REGISTER_MUTATION);
    logJson(res);
    expect(res.register.errors).toHaveLength(1);
  });
});

describe("check user was added", () => {
  it("and check that the user got added to the db", async () => {
    console.log(`${ANSI_ESCAPES.blue}`, `checking that the user got added to the DB`, `${ANSI_ESCAPES.reset}`);
    const connection = await connectDb();
    const users = await User.find({ where: { email: REGISTER_EMAIL }});
    console.log('users set', logJson(users));
    expect(users).toHaveLength(1);
    await connection.close();
  });
});

describe("do the logout mutation", () => {
  it("logs out", async () => {
    const res: LogoutResponse = await request(HOST + "/graphql", LOGOUT_MUTATION);
    console.log('logout response', res);

    expect(res.logout.user?.email).toEqual(REGISTER_EMAIL);
    expect(res.logout.user?.username).toEqual(REGISTER_USERNAME);
    expect(res.logout.user?.token).toEqual("");
  });
});

describe("checks the delete action", () => {
  it("checks if we delete the user we just made", async () => {
    const connection = await connectDb();
    await User.delete({ email: REGISTER_EMAIL });
    const users = await User.find({ where: { email: REGISTER_EMAIL } });
    console.log(`${ANSI_ESCAPES.blue}`, `deleting a user ${users}`, `${ANSI_ESCAPES.reset}`);
    logJson(users);
    expect(users).toHaveLength(0);
    await connection.close();
  }); 
});
