export function createMeQuery(): string {
  return `
    query me {
      me {
        token
        username
        email
        id
      }
    }
  `
}