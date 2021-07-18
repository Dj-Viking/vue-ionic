import decode, { JwtPayload } from 'jwt-decode';
import jwt from "jsonwebtoken";
import { UserState } from '@/types';

class AuthService {

  public async getProfile(): Promise<JwtPayload | false> {
    if (typeof (await this.getToken()) === "string") {
      const profile = await decode((await this.getToken()) as string);
      return profile;
    } else return false;
  }

  public async loggedIn(): Promise<boolean> {
    // Checks if there is a saved token and it's still valid
    const token = await this.getToken();
    //is token a truthy value and token is not expired
    return !!token && !this.isTokenExpired(token);
  }

  public isTokenExpired(token: string): boolean {
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

  public async getToken(): Promise<string | false> {
    // Retrieves the user token from localStorage
    return new Promise((resolve) => {
      const token = localStorage.getItem('id_token');
      token ? resolve(token) : resolve(false);
    })
  }

  public async setToken(token: string): Promise<void> {
    // Saves user token to localStorage
    return new Promise((resolve) => {
      localStorage.setItem('id_token', token);
      resolve();
    });
  }

  public signToken(user: UserState): string {
    const payload = {
      username: user.username,
      email: user.email,
    };
  
    return jwt.sign(payload,
                    payload.toString() as string,
                    { expiresIn: "2h" });
  }

  public async clearToken(): Promise<void | null> {
      const token = await this.getToken();
      if (token) {
        localStorage.removeItem('id_token');
      } else return null;
  }
}

export default new AuthService();