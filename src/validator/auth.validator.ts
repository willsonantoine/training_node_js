import { body } from "express-validator";

const create = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3, max: 40 })
    .withMessage("name must be between 3 and 40 characters"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email is not valid"),
  body("password").notEmpty().withMessage("password is required"),
  body("password_confirm")
    .notEmpty()
    .withMessage("password confirm is required"),
];

export default { create };
