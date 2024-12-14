import express from "express";
import authController from "../controllers/auth.controller";
import { Validator } from "../utils/vars";
import authValidator from "../validator/auth.validator";

const AuthRouter = express.Router();

AuthRouter.post(
  "/create",
  Validator(authValidator.create),
  authController.create
);

export default AuthRouter;
