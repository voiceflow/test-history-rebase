import { createCRUDState } from '@/ducks/utils/crud';

import { CommentingState } from './types';

export const STATE_KEY = 'thread';

export const INITIAL_STATE: CommentingState = {
  ...createCRUDState(),
  hasUnreadComments: false,
};
