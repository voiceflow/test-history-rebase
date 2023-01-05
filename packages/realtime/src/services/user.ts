import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { User } from '@voiceflow/socket-utils';

import { AbstractControl } from '../control';

class UserService extends AbstractControl {
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

    const isIdentityUserEnabled = this.services.feature.isEnabled(Realtime.FeatureFlag.IDENTITY_USER);

    let user: User | null = null;

    if (isIdentityUserEnabled) {
      const ownUser = await this.services.voiceflow.getClientByToken(token).identity.user.getSelf();

      user = { ...ownUser, creator_id: ownUser.id, image: ownUser.image ?? '' };
    } else {
      user = await this.services.voiceflow.getClientByToken(token).user.get();
    }

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

export default UserService;
