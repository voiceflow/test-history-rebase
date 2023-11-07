import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { BaseProjectPlatformClient } from './base.client';

export class AlexaClient extends BaseProjectPlatformClient<Realtime.AlexaProject> {
  constructor(baseURL: string, token: string) {
    super(baseURL, token);
  }
}
