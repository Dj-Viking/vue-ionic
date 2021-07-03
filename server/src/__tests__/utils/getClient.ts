import ApolloClient from "apollo-boost";
import { ANSI_ESCAPES } from "src/types";
import "reflect-metadata";

export const getClient = (token: string) => {
  return new ApolloClient({
    uri: "http://localhost:4000/",
    request: (operation) => {
      if (token) {
        operation.setContext({
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
      }
    },
    onError: (e) => console.log(
      ANSI_ESCAPES.red,
      "error while initializing apollo client in the user test " + e,
      ANSI_ESCAPES.reset)
  });
}
