import React from 'react';

import { EditableCommentRef } from '@/pages/Canvas/components/ThreadEditor';
import { CommentDraftValue, NewCommentAPI } from '@/pages/Canvas/types';
import { Coords } from '@/utils/geometry';

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
