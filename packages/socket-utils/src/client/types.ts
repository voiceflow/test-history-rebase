import { Logger } from '@voiceflow/logger';

export interface BaseClientOptions<C> {
  config: C;
  log: Logger;
}
