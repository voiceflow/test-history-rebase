import { Thread } from '@voiceflow/realtime-sdk';

import * as CRUD from '@/ducks/utils/crud';

export interface CommentingState extends CRUD.CRUDState<Thread> {
  hasUnreadComments: boolean;
}
