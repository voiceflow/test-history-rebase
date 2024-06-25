import { Inject, Injectable } from '@nestjs/common';
import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { MemoizedClient } from '@/common';
import { UserService } from '@/user/user.service';

import { AlexaClient } from './client/alexa.client';
import { GeneralClient } from './client/general.client';
import { ProjectPlatformModuleOptions } from './project-platform.interface';
import { PROJECT_PLATFORM_MODULE_OPTIONS_TOKEN } from './project-platform.module-definition';

@Injectable()
export class ProjectPlatformService {
  private generalClient = new MemoizedClient(
    this.user,
    (token) => new GeneralClient(this.options.generalBaseURL, token)
  );

  private alexaClient = new MemoizedClient(this.user, (token) => new AlexaClient(this.options.alexaBaseURL, token));

  constructor(
    @Inject(UserService)
    private readonly user: UserService,
    @Inject(PROJECT_PLATFORM_MODULE_OPTIONS_TOKEN)
    private readonly options: ProjectPlatformModuleOptions
  ) {}

  public getClient(platform: Platform.Constants.PlatformType) {
    return Realtime.Utils.platform.getPlatformValue(
      platform,
      {
        [Platform.Constants.PlatformType.ALEXA]: this.alexaClient,
      },
      this.generalClient
    );
  }
}
