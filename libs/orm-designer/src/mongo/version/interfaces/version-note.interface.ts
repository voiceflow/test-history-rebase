import type { AnyRecord } from '@voiceflow/common';

export interface VersionNote {
  id: string;
  type: string;
  text: string;
  meta?: AnyRecord;
  mentions: number[];
}
