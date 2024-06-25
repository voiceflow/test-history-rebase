import type React from 'react';

import type { EditableCommentRef } from '@/pages/Canvas/components/ThreadEditor';
import type { ThreadInstance } from '@/pages/Canvas/engine/entities/threadEntity';

export interface InternalThreadInstance<T extends HTMLElement> extends ThreadInstance {
  ref: React.RefObject<T>;
  commentRef: React.RefObject<EditableCommentRef>;
}
