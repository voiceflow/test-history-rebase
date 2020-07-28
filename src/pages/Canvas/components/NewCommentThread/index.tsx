import React from 'react';

import { useLinkedRef } from '@/hooks';
import { CommentIndicator } from '@/pages/Canvas/components/CommentThread/components';
import { useThreadHandlers } from '@/pages/Canvas/components/CommentThread/hooks';
import DragTarget from '@/pages/Canvas/components/DragTarget';
import ThreadEditor from '@/pages/Canvas/components/ThreadEditor';
import { EngineContext } from '@/pages/Canvas/contexts';

import { useNewCommentAPI, useNewCommentSubscription } from './hooks';

const NewCommentThread: React.FC = () => {
  const api = useNewCommentAPI();
  const originRef = useLinkedRef(api.origin);
  const engine = React.useContext(EngineContext)!;

  const handlers = useThreadHandlers(
    {
      drag: (movement) => {
        if (!originRef.current) return;

        const [originX, originY] = originRef.current;
        api.show(engine.canvas!.toCoords([originX + movement[0], originY + movement[1]]));
      },
      click: () => engine.comment.resetCreating(),
    },
    [api.origin]
  );

  useNewCommentSubscription(api);

  if (!api.origin) return null;

  return (
    <>
      <DragTarget position={api.origin} zIndex={10}>
        <CommentIndicator draggable tabIndex={-1} {...handlers}>
          1
        </CommentIndicator>
        <ThreadEditor origin={api.origin} />
      </DragTarget>
    </>
  );
};

export default React.memo(NewCommentThread);
