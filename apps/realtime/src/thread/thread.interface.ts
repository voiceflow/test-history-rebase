import { ThreadCommentEntity, ThreadORM } from '@voiceflow/orm-designer';

import { CreateOneData } from '@/common/types';

interface Comment extends Pick<ThreadCommentEntity, 'text' | 'mentions'> {
  authorID: number;
}

export interface ThreadCreateData extends CreateOneData<ThreadORM> {
  comments?: Comment[];
}
