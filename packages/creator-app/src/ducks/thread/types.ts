import * as CRUD from '@/ducks/utils/crud';
import { Thread } from '@/models';

export interface CommentingState extends CRUD.CRUDState<Thread> {
  hasUnreadComments: boolean;
}
