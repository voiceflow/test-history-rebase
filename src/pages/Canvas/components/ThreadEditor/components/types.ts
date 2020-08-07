import { Comment } from '@/models';

export type PartialComment = Pick<Comment, 'text' | 'mentions'>;
