import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { BaseProjectPlatformClient } from './base.client';

export class GeneralClient extends BaseProjectPlatformClient<Realtime.VoiceflowProject> {
  constructor(baseURL: string, token: string) {
    super(baseURL, token);
  }
}
