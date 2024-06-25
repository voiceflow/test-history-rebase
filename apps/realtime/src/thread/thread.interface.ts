import type { CreateData, ThreadCommentJSON, ThreadEntity } from '@voiceflow/orm-designer';

interface Comment extends Pick<ThreadCommentJSON, 'text' | 'mentions'> {
  authorID: number;
}

export interface ThreadCreateData extends CreateData<ThreadEntity> {
  comments?: Comment[];
}
