import UsersModel, { IUser } from "../model/users.model";

export default class AUthService {
  private user: typeof UsersModel;

  constructor() {
    this.user = UsersModel;
  }

  public create = async (user: IUser):Promise<IUser> => {
    return await this.user.create(user);
  };

  public findByEmail = async (email: string): Promise<IUser | null> => {
    return await this.user.findOne({ where: { email: email } });
  };
}
