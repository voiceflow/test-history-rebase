import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { BaseProjectPlatformClient } from './base.client';

export class GoogleClient extends BaseProjectPlatformClient<Realtime.GoogleProject> {
  constructor(baseURL: string, token: string) {
    super(baseURL, token);
  }
}
