import type { AnyRecord } from '@voiceflow/common';
import type { Logger } from '@voiceflow/logger';

export interface BaseClientOptions<C extends AnyRecord = AnyRecord> {
  config: C;
  log: Logger;
}
