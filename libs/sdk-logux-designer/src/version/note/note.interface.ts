import type { AnyRecord } from '@voiceflow/common';

export declare enum NoteType {
  INTENT = 'INTENT',
}

export interface BaseNote {
  id: string;
  type: NoteType;
  text: string;
  meta?: AnyRecord;
  mentions: number[];
}
