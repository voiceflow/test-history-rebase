import { AbstractControl, ControlOptions } from '@socket-utils/control';
import { User } from '@socket-utils/model';

export class UserService extends AbstractControl<ControlOptions> {
  // needed to explicitly add this constructor for it to be reusable for some reason
  // without it other projects think it doesn't take any arguments
  constructor(options: ControlOptions) {
    super(options);
  }

  private static getTokenUserKey({ token }: { token: string }): string {
    return `users:${token}`;
  }

  private static getUserIDTokenKey({ userID }: { userID: number }): string {
    return `users:${userID}:token`;
  }

  private static validateUserID(userID: number) {
    if (Number.isNaN(userID)) {
      throw new Error(`invalid user ID: ${userID}`);
    }
  }

  private userCache = this.clients.cache.createKeyValue({
    expire: 60,
    adapter: this.clients.cache.adapters.jsonAdapterCreator<User | null>(),
    keyCreator: UserService.getTokenUserKey,
  });

  private tokenCache = this.clients.cache.createKeyValue({
    keyCreator: UserService.getUserIDTokenKey,
  });

  private async cacheUser(token: string, user: User): Promise<void> {
    await Promise.all([this.userCache.set({ token }, user), this.tokenCache.set({ userID: user.creator_id }, token)]);
  }

  public async getUserByToken(token: string): Promise<User | null> {
    const cachedUser = await this.userCache.get({ token });

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.services.voiceflow.getClientByToken(token).user.get();

    if (user) {
      await this.cacheUser(token, user);
    }

    return user;
  }

  public async getUserTokenByID(userID: number): Promise<string | null> {
    UserService.validateUserID(userID);

    return this.tokenCache.get({ userID });
  }

  public async getUserByID(userID: number): Promise<User | null> {
    UserService.validateUserID(userID);

    const token = await this.getUserTokenByID(userID);

    if (!token) {
      return null;
    }

    return this.getUserByToken(token);
  }
}
