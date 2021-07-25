import decode, { JwtPayload } from 'jwt-decode';
import jwt from "jsonwebtoken";
import { UserState } from '@/types';

class AuthService {

  public async getProfile(): Promise<JwtPayload | false> {
    if (typeof this.getToken() === "string") {
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

  public async isTokenExpired(token: string): Promise<boolean | string> {
    console.log("token we're trying to check", token);
    
    try {
      if ((await this.getToken()) === null) return;
      const decoded: JwtPayload = decode(token);
      if (decoded.exp < Date.now() / 1000) 
        return true;
      else 
        return false;
    } catch (err) {
      console.error("error when verifying expiration", err);
      return "invalid token"
    }
  }

  public async getToken(): Promise<string | null> {
    return new Promise((resolve) => {
      // Retrieves the user token from localStorage
      const token = localStorage.getItem('id_token');
      if (token) resolve(token);
      else return resolve(null);
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

  public clearToken(): void {
      const token = this.getToken();
      if (token) {
        localStorage.removeItem('id_token');
      } else return;
  }
}

export default new AuthService();