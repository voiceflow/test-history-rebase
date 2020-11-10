import * as CRUD from '@/ducks/utils/crud';
import { Thread } from '@/models';

export type CommentingState = CRUD.CRUDState<Thread> & {
  hasUnreadComments: boolean;
};
