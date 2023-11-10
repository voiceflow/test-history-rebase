import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { BaseProjectPlatformClient } from './base.client';

export class DialogflowClient extends BaseProjectPlatformClient<Realtime.DialogflowProject> {
  constructor(baseURL: string, token: string) {
    super(`${baseURL}/dialogflow/es`, token);
  }
}
