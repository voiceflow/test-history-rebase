import type { Thread } from '@voiceflow/dtos';
import { createEmpty, type Normalized } from 'normal-store';

export const STATE_KEY = 'thread';

export interface ThreadState extends Normalized<Thread> {
  hasUnreadComments: boolean;
}

export const INITIAL_STATE: ThreadState = {
  ...createEmpty(),
  hasUnreadComments: false,
};
