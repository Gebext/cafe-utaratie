import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export function signToken(payload: object) {
  return jwt.sign(payload, secret as string, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, secret as string);
}
