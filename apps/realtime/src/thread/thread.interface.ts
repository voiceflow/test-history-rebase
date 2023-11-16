import { ThreadCommentEntity, ThreadORM } from '@voiceflow/orm-designer';

import { CreateOneForUserData } from '@/common/types';

interface Comment extends Pick<ThreadCommentEntity, 'text' | 'mentions'> {
  authorID: number;
}

export interface ThreadCreateData extends CreateOneForUserData<ThreadORM> {
  comments?: Comment[];
}
