import type { ThreadComment } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'comment';

export interface ThreadCommentState extends Normalized<ThreadComment> {}
