import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as bcrypt from "bcrypt";

export const Validator = (TabValidator: any) => [TabValidator, ValidateFields];
const ValidateFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: any = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error: any) => `${error.path}: ${error.msg}`)
      .join(", ");
    res.status(400).json({ message: errorMessages });
  } else {
    next();
  }
};

export const isStrongPassword = (password: string): boolean => {
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
};
export const encryptPassword = (password: string) => {
  // Générer un sel pour le cryptage
  let saltRounds = 10;
  let salt = bcrypt.genSaltSync(saltRounds);

  // Crypter le mot de passe
  return bcrypt.hashSync(password, salt);
};
