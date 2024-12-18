import AuthModel from "../model/auth.model";
import UsersModel, { IUser } from "../model/users.model";

export default class UsersService {
  private user: typeof UsersModel;
  private auth: typeof AuthModel;

  constructor() {
    this.user = UsersModel;
    this.auth = AuthModel;
  }

  public create = async (user: IUser): Promise<IUser> => {
    const userCreated = await this.user.create(user);
    const code = Math.floor(100000 + Math.random() * 900000);
    const codeExpireAt = new Date();
    codeExpireAt.setMinutes(codeExpireAt.getMinutes() + 15);
    await this.auth.create({ code, codeExpireAt, userId: userCreated.id });
    return userCreated;
  };

  public findByEmail = async (email: string): Promise<IUser | null> => {
    return await this.user.findOne({ where: { email: email } });
  };
}
