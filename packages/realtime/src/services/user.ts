import { AbstractControl } from '../control';
import { User } from '../models';

class UserService extends AbstractControl {
  private static getTokenUserKey({ token }: { token: string }): string {
    return `users:${token}`;
  }

  private static getUserIDTokenKey({ userID }: { userID: number }): string {
    return `users:${userID}:token`;
  }

  private userCache = this.clients.cache.createKeyValue({
    adapter: this.clients.cache.adapters.jsonAdapterCreator<User | null>(),
    keyCreator: UserService.getTokenUserKey,
  });

  // in case we want to get user by id, not by token, not using expire to do not expire key during request
  private tokenCache = this.clients.cache.createKeyValue({
    expire: false,
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
    return this.tokenCache.get({ userID });
  }

  public async getUserByID(userID: number): Promise<User | null> {
    const token = await this.getUserTokenByID(userID);

    if (!token) {
      return null;
    }

    return this.getUserByToken(token);
  }
}

export default UserService;
