import UsersService from "../services/users.service";
import { Request, Response } from "express";
import {
  decryptPassword,
  encryptPassword,
  isStrongPassword,
  setResponse,
} from "../utils/vars";
import { HttpRequest } from "../utils/http.request";
import { decrypt } from "dotenv";

class AuthController {
  private user: UsersService;
  constructor() {
    this.user = new UsersService();
  }

  create = async (req: Request, res: Response) => {
    const { name, email, password, password_confirm } = req.body;
    try {
      const userExist = await this.user.findByEmail(email);
      if (userExist) {
        setResponse({
          res,
          message: `${HttpRequest.CONFLICT.message} | Cette utilisateur exist`,
          statusCode: HttpRequest.CONFLICT.code,
        });
        return;
      }
      if (password !== password_confirm) {
        setResponse({
          res,
          message: HttpRequest.BAD_REQUEST.message,
          statusCode: HttpRequest.BAD_REQUEST.code,
        });
        return;
      }
      if (!isStrongPassword(password)) {
        setResponse({
          res,
          message: `${HttpRequest.BAD_REQUEST.message} | mot de passe faible`,
          statusCode: HttpRequest.BAD_REQUEST.code,
        });
        return;
      }
      const encrypt_password = encryptPassword(password);
      await this.user.create({ name, email, password: encrypt_password });

      setResponse({
        res,
        message: "user created successfully",
        statusCode: HttpRequest.CREATED.code,
      });
    } catch (error) {
      setResponse({
        res,
        message: "error creating user",
        statusCode: HttpRequest.INTERNAL_SERVER_ERROR.code,
        error: error,
      });
    }
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const userExist = await this.user.findByEmail(email);
      if (userExist) {
        if (!decryptPassword(userExist.password, password)) {
          setResponse({
            res,
            message: `${HttpRequest.UNAUTHORIZED.message} | mot de passe incorrect`,
            statusCode: HttpRequest.UNAUTHORIZED.code,
          });
          return;
        }
        setResponse({
          res,
          message: "user logged in successfully",
          statusCode: HttpRequest.CREATED.code,
        });
      }
    } catch (error) {
      setResponse({
        res,
        message: "error logging in user",
        statusCode: HttpRequest.INTERNAL_SERVER_ERROR.code,
        error: error,
      });
    }
  };
}

export default new AuthController();
