import { Inject, Injectable } from '@nestjs/common';

import { MemoizedClient } from '@/common';
import { UserService } from '@/user/user.service';

import { CreatorClient } from './client/creator.client';
import { CreatorModuleOptions } from './creator.interface';
import { CREATOR_MODULE_OPTIONS_TOKEN } from './creator.module-definition';

@Injectable()
export class CreatorService {
  public client = new MemoizedClient(this.user, (token) => new CreatorClient(this.options.baseURL, token));

  constructor(
    @Inject(UserService)
    private readonly user: UserService,
    @Inject(CREATOR_MODULE_OPTIONS_TOKEN)
    private readonly options: CreatorModuleOptions
  ) {}
}
