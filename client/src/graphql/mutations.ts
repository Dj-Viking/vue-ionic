import { gql } from "apollo-boost";

export const REGISTER_MUTATION = gql`
mutation register {
  register(options: {
    email: "viking123asdf@viking123asdf.com",
    password:"asdf",
    username: "viking123asdf"
  }){
    errors {
      field
      message
    }
    user{
      email
    }
  }
}`;