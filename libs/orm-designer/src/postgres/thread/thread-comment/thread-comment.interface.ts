import type { ToJSON, ToObject } from '@/types';

import type { ThreadCommentEntity } from './thread-comment.entity';

export type ThreadCommentObject = ToObject<ThreadCommentEntity>;
export type ThreadCommentJSON = ToJSON<ThreadCommentObject>;
