import { Inject, Injectable } from '@nestjs/common';
import moize from 'moize';

import { UserService } from '@/user/user.service';

import { CreatorClient } from './client/creator.client';
import { CreatorModuleOptions } from './creator.interface';
import { CREATOR_MODULE_OPTIONS_TOKEN } from './creator.module-definition';

const MAX_CACHE_AGE = 8 * 60 * 60 * 1000; // 8 hours
const MAX_CACHE_SIZE = 1000;

@Injectable()
export class CreatorService {
  constructor(
    @Inject(UserService)
    private readonly user: UserService,
    @Inject(CREATOR_MODULE_OPTIONS_TOKEN)
    private readonly options: CreatorModuleOptions
  ) {}

  private getMoizedClient = moize((token: string) => new CreatorClient(this.options.baseURL, token), {
    maxAge: MAX_CACHE_AGE,
    maxSize: MAX_CACHE_SIZE,
  });

  public async getClientByUserID(userID: number): Promise<CreatorClient> {
    const token = await this.user.getTokenByID(userID);

    if (!token) {
      throw new Error('Token not found');
    }

    return this.getMoizedClient(token);
  }

  public getClientByToken(token: string): CreatorClient {
    return this.getMoizedClient(token);
  }
}
