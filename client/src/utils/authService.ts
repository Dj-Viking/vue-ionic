import decode, { JwtPayload } from 'jwt-decode';

class AuthService {

  async getProfile(): Promise<JwtPayload | false> {
    if (typeof (await this.getToken()) === "string") {
      return decode((await this.getToken()) as string);  
    } else return false;
  }

  async loggedIn(): Promise<boolean> {
    return new Promise(async (resolve) => {
      // Checks if there is a saved token and it's still valid
      const token = await this.getToken();
      //is token a truthy value and token is not expired
      return resolve(!!token && !this.isTokenExpired(token));
    });
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: JwtPayload = decode(token);
      if (decoded.exp < Date.now() / 1000) 
        return true;
      else 
        return false;
    } catch (err) {
      return false;
    }
  }

  async getToken(): Promise<string | false> {
    // Retrieves the user token from localStorage
    return new Promise((resolve) => {
      const token = localStorage.getItem('id_token');
      !!token ? resolve(token) : resolve(false);
    })
  }

  async setToken(token: string): Promise<void> {
    // Saves user token to localStorage
    return new Promise((resolve) => {
      localStorage.setItem('id_token', token);
      resolve();
    });
  }

  async clearToken(): Promise<void> {
    return new Promise(async (resolve) => {
      const token = await this.getToken();
      if (!!token) {
        localStorage.removeItem('id_token');
        resolve()
      } else return;
    });
  }
}

export default new AuthService();