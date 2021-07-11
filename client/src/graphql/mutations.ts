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
        }
      }
    }
  `;
}
export function createLogoutMutation(): string {
  return `
    mutation logout{
      logout
    }
  `;
}