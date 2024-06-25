import React from 'react';

import type { EditableCommentRef } from '@/pages/Canvas/components/ThreadEditor';
import type { CommentDraftValue, NewCommentAPI } from '@/pages/Canvas/types';
import type { Coords } from '@/utils/geometry';

export interface InternalNewCommentAPI extends NewCommentAPI {
  origin: Coords | null;
  commentRef: React.RefObject<EditableCommentRef>;
}

export const useNewCommentAPI = () => {
  const commentRef = React.useRef<EditableCommentRef>(null);

  const [origin, setOrigin] = React.useState<Coords | null>(null);

  return React.useMemo<InternalNewCommentAPI>(
    () => ({
      show: (coords) => setOrigin(coords),
      hide: () => setOrigin(null),
      origin,
      getDraft: () => commentRef.current?.getDraft() ?? null,
      setDraft: (value: CommentDraftValue) => commentRef.current?.setDraft(value) ?? null,
      getOrigin: () => origin,
      commentRef,
    }),
    [origin]
  );
};
