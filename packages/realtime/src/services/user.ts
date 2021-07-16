import { AbstractControl } from '../control';
import { User } from '../models';
import { DEFAULT_EXPIRE_MODE, DEFAULT_EXPIRE_TIME } from './constants';

class UserService extends AbstractControl {
  private static getTokenUserKey(token: string): string {
    return `users:${token}`;
  }

  private static getUserIDTokenKey(userID: number): string {
    return `users:${userID}:token`;
  }

  private async getCachedUser(token: string): Promise<User | null> {
    const cachedUserJSON = await this.clients.redis.get(UserService.getTokenUserKey(token));

    let cachedUser: User | null = null;

    if (cachedUserJSON) {
      try {
        cachedUser = JSON.parse(cachedUserJSON) || null;
      } catch {
        // empty
      }
    }

    return cachedUser;
  }

  private async cacheUser(token: string, user: User): Promise<void> {
    await Promise.all([
      this.clients.redis.set(UserService.getTokenUserKey(token), JSON.stringify(user), DEFAULT_EXPIRE_MODE, DEFAULT_EXPIRE_TIME),
      // in case we want to get user by id, not by token, not using expire to do not expire key during request
      this.clients.redis.set(UserService.getUserIDTokenKey(user.creator_id), token),
    ]);
  }

  public async getUserByToken(token: string): Promise<User | null> {
    const cachedUser = await this.getCachedUser(token);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.clients.api.user.get(token);

    if (user) {
      await this.cacheUser(token, user);
    }

    return user;
  }

  public async getUserByID(userID: number): Promise<User | null> {
    const token = await this.clients.redis.get(UserService.getUserIDTokenKey(userID));

    if (!token) {
      return null;
    }

    return this.getUserByToken(token);
  }
}

export default UserService;
