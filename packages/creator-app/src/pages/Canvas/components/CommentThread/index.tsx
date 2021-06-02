import React from 'react';

import { EngineContext, FocusThreadContext, ThreadEntityContext } from '@/pages/Canvas/contexts';
import { useCanvasPan, useCanvasZoom } from '@/pages/Canvas/hooks';
import { ClassName } from '@/styles/constants';
import { Vector } from '@/utils/geometry';

import { CANVAS_THREAD_OPEN_CLASSNAME } from '../../constants';
import { CommentIndicator, DragTarget, ThreadEditor } from './components';
import { useThreadHandlers, useThreadInstance } from './hooks';

const CommentThread: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const focusThread = React.useContext(FocusThreadContext)!;
  const threadEntity = React.useContext(ThreadEntityContext)!;
  const instance = useThreadInstance<HTMLDivElement>();
  const { isFocused } = threadEntity.useState((e) => ({
    isFocused: e.isFocused,
  }));

  const { onDoubleClick, ...handlers } = useThreadHandlers({
    drag: (movement) => engine.comment.dragThread(threadEntity.threadID, engine.canvas!.toVector(movement)),
    drop: () => engine.comment.dropThread(),
    mousedown: () => engine.comment.setTarget(threadEntity.threadID),
    mouseup: () => engine.comment.setTarget(null),
    click: async () => {
      if (threadEntity.isFocused) {
        focusThread.resetFocus();
      } else {
        await focusThread.setFocus(threadEntity.threadID);
      }
    },
    doubleClick: () => engine.comment.centerThread(threadEntity.threadID),
  });

  useCanvasPan((movement) => instance.translate(new Vector(movement)));

  useCanvasZoom((calculateMovement) => {
    const [moveX, moveY] = calculateMovement(instance.getCoords().map(engine.canvas!.getOuterPlane()));

    instance.translate(new Vector([moveX, moveY]));
  }, []);

  React.useEffect(() => {
    if (!isFocused) return undefined;

    engine.addClass(CANVAS_THREAD_OPEN_CLASSNAME);

    return () => engine.removeClass(CANVAS_THREAD_OPEN_CLASSNAME);
  }, [isFocused]);

  threadEntity.useInstance(instance);

  const origin = instance.getCoords().map(engine.canvas!.getOuterPlane());

  return (
    <DragTarget
      isTransform
      onDoubleClick={onDoubleClick}
      className={ClassName.CANVAS_THREAD}
      data-thread-id={threadEntity.threadID}
      position={origin}
      ref={instance.ref}
      zIndex={isFocused ? 10 : undefined}
    >
      <CommentIndicator className={`${ClassName.CANVAS_THREAD}__indicator`} draggable tabIndex={-1} {...handlers} isFocused={isFocused}>
        {threadEntity.threadOrder}
      </CommentIndicator>
      {isFocused && <ThreadEditor />}
    </DragTarget>
  );
};

export default React.memo(CommentThread);
