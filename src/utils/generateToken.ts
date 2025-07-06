import jwt from "jsonwebtoken";

const generateToken = (
  key: string,
  secret: string,
  tokenField: string,
  tokenExpiresInMin: string
): string => {
  return jwt.sign({ [key]: secret }, tokenField, {
    expiresIn: parseInt(tokenExpiresInMin) * 60 * 1000,
  });
};

export default generateToken;
