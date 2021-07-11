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