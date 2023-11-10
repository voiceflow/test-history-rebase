import { Inject, Injectable } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';
import { Nullish } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import moize from 'moize';

import { MAX_CACHE_AGE, MAX_CACHE_SIZE } from '@/common/fetch';
import { UserService } from '@/user/user.service';

import { AlexaClient } from './client/alexa.client';
import { BaseProjectPlatformClient } from './client/base.client';
import { DialogflowClient } from './client/dialogflow.client';
import { GeneralClient } from './client/general.client';
import { GoogleClient } from './client/google.client';
import { ProjectPlatformModuleOptions } from './project-platform.interface';
import { PROJECT_PLATFORM_MODULE_OPTIONS_TOKEN } from './project-platform.module-definition';

const CACHE_CONFIG = {
  maxAge: MAX_CACHE_AGE,
  maxSize: MAX_CACHE_SIZE,
};

@Injectable()
export class ProjectPlatformService {
  constructor(
    @Inject(UserService)
    private readonly user: UserService,
    @Inject(PROJECT_PLATFORM_MODULE_OPTIONS_TOKEN)
    private readonly options: ProjectPlatformModuleOptions
  ) {}

  private getGeneralClient = moize((token: string) => new GeneralClient(this.options.generalBaseURL, token), CACHE_CONFIG);

  private getAlexaClient = moize((token: string) => new AlexaClient(this.options.alexaBaseURL, token), CACHE_CONFIG);

  private getGoogleClient = moize((token: string) => new GoogleClient(this.options.googleBaseURL, token), CACHE_CONFIG);

  private getDialogflow = moize((token: string) => new DialogflowClient(this.options.googleBaseURL, token), CACHE_CONFIG);

  private getPlatformClientSelector(token: string) {
    return Realtime.Utils.platform.createPlatformSelector<AlexaClient | GoogleClient | DialogflowClient | GeneralClient>(
      {
        [Platform.Constants.PlatformType.ALEXA]: this.getAlexaClient(token),
        [Platform.Constants.PlatformType.GOOGLE]: this.getGoogleClient(token),
        [Platform.Constants.PlatformType.DIALOGFLOW_ES]: this.getDialogflow(token),
      },
      this.getGeneralClient(token)
    ) as <P extends BaseModels.Project.Model<any, any>>(platform?: Nullish<Platform.Constants.PlatformType>) => BaseProjectPlatformClient<P>;
  }

  public async getPlatformClientByUser<P extends BaseModels.Project.Model<any, any>>(
    userID: number,
    platform: Platform.Constants.PlatformType
  ): Promise<BaseProjectPlatformClient<P>> {
    const token = await this.user.getTokenByID(userID);

    if (!token) {
      throw new Error('Token not found');
    }

    return this.getPlatformClientSelector(token)(platform);
  }

  public getPlatformClientByToken<P extends BaseModels.Project.Model<any, any>>(
    token: string,
    platform: Platform.Constants.PlatformType
  ): BaseProjectPlatformClient<P> {
    return this.getPlatformClientSelector(token)(platform);
  }
}
