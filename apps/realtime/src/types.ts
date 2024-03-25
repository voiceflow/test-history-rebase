import { AuthMetaPayload } from '@voiceflow/nestjs-logux';

import { EnvironmentVariables } from './app.env';

export type Config = EnvironmentVariables;

export interface CMSContext {
  assistantID: string;
  environmentID: string;
}

export interface CMSBroadcastMeta {
  auth: AuthMetaPayload;
  context: CMSContext;
}
