export function createRegisterMutation(): string {
  return `
    mutation register($options: RegisterInput!) {
      register(options: $options){
        errors {
          field
          message
        }
        user{
          email
        }
      }
    }
  `;
}
export function createLoginMutation(): string {
  return `
    mutation login($options: LoginInput!) {
      login(options: $options){
        errors {
          field
          message
        }
        user{
          email
          token
          username
        }
      }
    }
  `;
}
export function createLogoutMutation(): string {
  return `
  mutation logout($email: String!) {
    logout(email: $email){
      errors{
        field
        message
      }
      user {
        username
        email
        token
      }
    }
  }`;
}