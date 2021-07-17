import decode, { JwtPayload } from 'jwt-decode';

class AuthService {

  getProfile(): JwtPayload | false {
    if(typeof this.getToken() === "string"){
      return decode(this.getToken() as string);  
    } else {
      return false
    }
  }

  loggedIn(): boolean {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    //is token a truthy value and token is not expired
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: JwtPayload = decode(token);
      if (decoded.exp && decoded.exp < Date.now() / 1000) 
        return true;
      else 
        return false;
    } catch (err) {
      return false;
    }
  }

  getToken(): string | false {
    // Retrieves the user token from localStorage
    const token = localStorage.getItem('id_token');
    if (token) {
      return token;
    } else {
      return false;
    }
  }

  login(token: string): void {
    // Saves user token to localStorage
    return localStorage.setItem('id_token', token);
  }

  logout(): void {
    // Clear user token and profile data from localStorage
    return localStorage.removeItem('id_token');
  }
}

export default new AuthService();