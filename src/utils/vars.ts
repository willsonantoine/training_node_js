import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as bcrypt from "bcrypt";
import * as fs from "fs";
import moment from "moment";
import path from "path"; 
import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "./constant";
import multer from "multer";
import { HttpRequest } from "./http.request";

export const Validator = (TabValidator: any) => [TabValidator, ValidateFields];


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



// Vérifier et créer le dossier de destination si nécessaire
const uploadDirectory = "uploads/";
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: function (req: Request, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req:Request, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + extension);
  },
});
const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".xlsx",
  ".xls",
  ".pdf",
  ".doc",
  ".docx",
  ".csv",
];
const fileFilter = (req: Request, file: any, cb: any) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const maxFileSize = 5 * 1024 * 1024;

export const uploadFile = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: maxFileSize,
  },
});

export const validateFileUpload = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) {
    setResponse({
      res,
      message: `Aucun fichier n'a été téléchargé, veuillez vérifier les critères de téléchargement des fichiers avant d'effectuer cette action. nous prenons en charge les formats : ${allowedExtensions.join(
        ", ",
      )} et la taille maximun est : ${maxFileSize / 1024 / 1024} Méga`,
      statusCode: HttpRequest.BAD_REQUEST.code,
    });
  } else {
    next();
  }
};

export const pagination = (req: Request) => {
  let page: number | any = req.query.page || 1; // page = 1
  let limit: number | any = req.query.limit || 10; // nombre d'enregistrements par page 10
  let offset = (page - 1) * limit;

  return { limit: parseInt(limit), offset: parseInt(String(offset)) };
};
export function generateToken(id: string, role: string) {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: "2190h",
  });
}
const ValidateFields = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: any = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error: any) => `${error.path}: ${error.msg}`)
      .join(", ");
    setResponse({
      res,
      message: `${errorMessages}`,
      statusCode: HttpRequest.BAD_REQUEST.code,
      data: req.body,
    });
  } else {
    next();
  }
};
export const Val = (TabValidator: any) => [TabValidator, ValidateFields];
interface IResponse {
  res: Response;
  message: string;
  statusCode?: number;
  data?: any | null;
  error?: any | null;
}
export function setResponse({
  res,
  message,
  statusCode = 200,
  data = null,
  error = null,
}: IResponse) {
  // Logging en cas d'erreur
  if (statusCode >= 500 && error) {
    console.error(
      `[${new Date().toISOString()}] Internal Server Error:`,
      error,
    );
    writeLogToFile(error, "internal-server-error");
  }

  // Définit si la réponse est un succès ou un échec
  const success = statusCode >= 200 && statusCode < 400;

  // Format de la réponse JSON
  return res
    .status(statusCode)
    .setHeader("Content-Type", "application/json")
    .json({
      success,
      status: statusCode,
      message,
      data,
      ...(error && {
        error: NODE_ENV === "dev" ? error : "An internal error occurred",
      }), // Expose l'erreur uniquement en mode dev
    });
}

export function formatPhoneNumber(phoneNumber: string): string {
  // Vérifie si le numéro commence par "+"
  if (!phoneNumber.startsWith("+")) {
    // Ajoute un "+" au début si ce n'est pas le cas
    phoneNumber = "+" + phoneNumber;
  }
  return phoneNumber;
}

export async function writeLogToFile(
  log: any,
  file: string = "log",
  send_to_slake = true,
) {
  try {
    const logDirectory = "./logs";
    const date = formatDate(getDate(new Date())).substring(0, 10);
    const logFilePath = path.join(logDirectory, `${file}-error-${date}.log`);

    // Vérifier si le dossier "logs" existe, sinon le créer
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory);
    }

    fs.appendFile(
      logFilePath,
      `${getDateTime(new Date())} ::: ${log} \n`,
      (err) => {
        if (err) {
          console.error("Error writing log to file:", err);
        }
      },
    );
    // sendAdminNotifications(log.message, EnumNotification.ERROR);
  } catch (error) {
    console.log(error);
  }
}

const getDate = (dateParam: string | any) => {
  // Convert date
  return dateParam != undefined || dateParam != null
    ? dateParam
    : new Date().toISOString().split("T")[0];
};

const getDateTime = (dateTimeParam: Date) => {
  const dateTime = dateTimeParam || new Date();
  const year = dateTime.getFullYear();
  const month = String(dateTime.getMonth() + 1).padStart(2, "0");
  const day = String(dateTime.getDate()).padStart(2, "0");
  const hours = String(dateTime.getHours()).padStart(2, "0");
  const minutes = String(dateTime.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} à ${hours}h ${minutes} min`;
};
function formatDate(datetime: Date) {
  return moment(datetime).format("YYYY-MM-DD HH:mm:ss");
}

export default { getDate, getDateTime, formatDate };
