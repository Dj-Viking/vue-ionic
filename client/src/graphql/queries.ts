export function createMeQuery(): string {
  return `
    query me {
      me {
        username
        email
        id
      }
    }
  `
}