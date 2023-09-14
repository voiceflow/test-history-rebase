import { Inject, Injectable } from '@nestjs/common';
import type { Identity } from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';
import type { MultiAdapter } from 'bidirectional-adapter';

import type { KeyValueStrategy } from '@/cache/cache.service';
import { CacheService } from '@/cache/cache.service';

export interface User extends Omit<Identity.User, 'createdAt' | 'updatedAt'> {
  creator_id: number;
}

@Injectable()
export class UserService {
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

  private userCache: KeyValueStrategy<typeof UserService.getTokenUserKey, MultiAdapter<string, User | null>>;

  private tokenCache: KeyValueStrategy<typeof UserService.getUserIDTokenKey>;

  constructor(
    @Inject(CacheService)
    private readonly cache: CacheService,
    @Inject(IdentityClient)
    private readonly identityClient: IdentityClient
  ) {
    this.userCache = this.cache.keyValueStrategyFactory({
      expire: 60,
      adapter: this.cache.adapters.jsonAdapterFactory<User | null>(),
      keyCreator: UserService.getTokenUserKey,
    });

    this.tokenCache = this.cache.keyValueStrategyFactory({
      keyCreator: UserService.getUserIDTokenKey,
    });
  }

  public async getByToken(token: string): Promise<User | null> {
    const cachedCreator = await this.userCache.get({ token });

    if (cachedCreator) {
      return cachedCreator;
    }

    const ownUser = await this.identityClient.user.findSelf({ headers: { Authorization: `Bearer ${token}` } }).catch(() => null);

    // add creator_id for legacy support
    const user: User | null = ownUser && { ...ownUser, creator_id: ownUser.id };

    if (user) {
      await Promise.all([this.tokenCache.set({ userID: user.id }, token), this.userCache.set({ token }, user)]);
    }

    return user;
  }

  public async getTokenByID(userID: number): Promise<string | null> {
    UserService.validateUserID(userID);

    return this.tokenCache.get({ userID });
  }

  public async getByID(userID: number): Promise<User | null> {
    const token = await this.getTokenByID(userID);

    if (!token) {
      return null;
    }

    return this.getByToken(token);
  }

  public async getAuthHeadersByID(userIDToken: number | string): Promise<Record<string, string>> {
    const token = typeof userIDToken === 'string' ? userIDToken : await this.getTokenByID(userIDToken);

    if (!token) {
      throw new Error(`token not found: ${userIDToken}`);
    }

    return { Authorization: `Bearer ${token}` };
  }
}
