import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/sequelize";

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class UsersModel extends Model<IUser> implements IUser {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}
UsersModel.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize: sequelize, tableName: "users", paranoid: true }
);


export default UsersModel;