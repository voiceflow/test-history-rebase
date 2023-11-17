import moize from 'moize';

import { MAX_CACHE_AGE, MAX_CACHE_SIZE } from '@/common/fetch';
import { UserService } from '@/user/user.service';

export class MemoizedClient<Client> {
  constructor(private readonly user: UserService | (() => UserService), private readonly factory: (token: string) => Client) {}

  private getMoizedClient = moize(this.factory, {
    maxAge: MAX_CACHE_AGE,
    maxSize: MAX_CACHE_SIZE,
  });

  public async getByUserID(userID: number): Promise<Client> {
    const user = typeof this.user === 'function' ? this.user() : this.user;

    const token = await user.getTokenByID(userID);

    if (!token) {
      throw new Error('Token not found');
    }

    return this.getMoizedClient(token);
  }

  public getByToken(token: string): Client {
    return this.getMoizedClient(token);
  }
}
