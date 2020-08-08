import React from 'react';

import { useLinkedRef, useRegistration } from '@/hooks';
import { CommentIndicator } from '@/pages/Canvas/components/CommentThread/components';
import { useThreadHandlers } from '@/pages/Canvas/components/CommentThread/hooks';
import DragTarget from '@/pages/Canvas/components/DragTarget';
import ThreadEditor from '@/pages/Canvas/components/ThreadEditor';
import { CANVAS_THREAD_OPEN_CLASSNAME } from '@/pages/Canvas/constants';
import { EngineContext } from '@/pages/Canvas/contexts';
import { useCanvasPan, useCanvasZoom } from '@/pages/Canvas/hooks';
import { Coords } from '@/utils/geometry';

import { useNewCommentAPI } from './hooks';

const NewCommentThread: React.FC = () => {
  const api = useNewCommentAPI();
  const originRef = useLinkedRef(api.origin);
  const engine = React.useContext(EngineContext)!;

  const drag = React.useCallback((movement) => {
    if (!originRef.current) return;

    api.show(originRef.current.add(movement, engine.canvas!.getPlane()));
  }, []);

  const handlers = useThreadHandlers(
    {
      drag,
      click: () => engine.comment.resetCreating(),
    },
    [api.origin]
  );

  useRegistration(() => engine.comment.register('newComment', api), [api]);

  useCanvasPan((movement) => originRef.current && api.show(originRef.current.add(movement, Coords.WINDOW_PLANE)), []);

  useCanvasZoom((calculateMovement) => {
    if (!originRef.current) return;

    const [moveX, moveY] = calculateMovement(originRef.current.map(engine.canvas!.getOuterPlane()));

    api.show(originRef.current.add([moveX, moveY], engine.canvas!.getOuterPlane()));
  }, []);

  React.useEffect(() => {
    if (!api.origin) return undefined;

    engine.addClass(CANVAS_THREAD_OPEN_CLASSNAME);

    return () => engine.removeClass(CANVAS_THREAD_OPEN_CLASSNAME);
  }, [api.origin]);

  if (!api.origin) return null;

  const origin = api.origin.map(engine.canvas!.getOuterPlane());

  return (
    <>
      <DragTarget position={origin} zIndex={10}>
        <CommentIndicator draggable tabIndex={-1} {...handlers}>
          1
        </CommentIndicator>
        <ThreadEditor origin={api.origin} />
      </DragTarget>
    </>
  );
};

export default React.memo(NewCommentThread);
