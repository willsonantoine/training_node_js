import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/sequelize";
import UsersModel from "./users.model";

export interface IAuthModel {
  id?: string;
  code?: number;
  codeExpireAt?: Date;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class AuthModel extends Model<IAuthModel> implements IAuthModel {
  public id!: string;
  public code!: number;
  public codeExpireAt!: Date;
  public userId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

AuthModel.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    codeExpireAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize: sequelize, tableName: "auth", paranoid: true }
);

AuthModel.belongsTo(UsersModel, {
  foreignKey: "userId",
  as: "user",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE"
});

export default AuthModel;
