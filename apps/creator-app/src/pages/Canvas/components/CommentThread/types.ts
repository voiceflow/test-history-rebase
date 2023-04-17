import React from 'react';

import { EditableCommentRef } from '@/pages/Canvas/components/ThreadEditor';
import { ThreadInstance } from '@/pages/Canvas/engine/entities/threadEntity';

export interface InternalThreadInstance<T extends HTMLElement> extends ThreadInstance {
  ref: React.RefObject<T>;
  commentRef: React.RefObject<EditableCommentRef>;
}
