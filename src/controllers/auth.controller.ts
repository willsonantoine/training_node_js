import UsersService from "../services/users.service";
import { Request, Response } from "express";
import { encryptPassword, isStrongPassword } from "../utils/vars";

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
        res.status(400).json({ message: "user already exist" });
        return;
      }
      if (password !== password_confirm) {
        res.status(400).json({ message: "password not match" });
        return;
      }
      if (!isStrongPassword(password)) {
        res.status(400).json({ message: "password not strong" });
        return;
      }
      const encrypt_password = encryptPassword(password);
      await this.user.create({ name, email, password: encrypt_password });
      res.status(201).json({ message: "user created" });
    } catch (error) {
      res.status(500).json({ message: "error creating user", error });
    }
  };
}

export default new AuthController();
