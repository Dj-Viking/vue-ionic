
// import { startServer } from "../index"
import { request } from "graphql-request";
import { HOST } from "../constants";
// import { LoginMutation } from "./utils/generated/graphql";
// import ApolloClient, { gql } from "apollo-boost";
const username ="viking"
const email = "viking@viking.com";
const password = "viking";

const mutation = `
mutation register {
  register(options: {
    email: "${email}",
    password:"${password}",
    username: "${username}"
  }){
    user{
      id
    }
  }
}
`

describe("Tests the user register", () => {
  it("get expected response from the mutation", async () => {
    const res = await request(HOST + "/graphql", mutation);
    const correct = {
      "register": {
        "user": {
          "id": 1,
        },
      }
    }
    expect(res).toEqual(correct)
  });
});