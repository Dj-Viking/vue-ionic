import { User } from "src/entities/User";
import jwt from "jsonwebtoken";
require("dotenv").config();

const {
  SECRET,
  EXPIRATION
} = process.env;

export function signToken(user: User): string {
  const payload = {
    username: user.username,
    id: user.id,
    email: user.email
  };

  return jwt.sign({ data: payload },
                  SECRET as string,
                  { expiresIn: EXPIRATION });
}