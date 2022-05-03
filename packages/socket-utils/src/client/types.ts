import { AnyRecord } from '@voiceflow/common';
import { Logger } from '@voiceflow/logger';

export interface BaseClientOptions<C extends AnyRecord = AnyRecord> {
  config: C;
  log: Logger;
}
