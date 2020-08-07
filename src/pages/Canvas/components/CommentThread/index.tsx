import React from 'react';

import { EngineContext, FocusThreadContext, ThreadEntityContext } from '@/pages/Canvas/contexts';
import { useCanvasPan, useCanvasZoom } from '@/pages/Canvas/hooks';
import { ClassName } from '@/styles/constants';
import { Vector } from '@/utils/geometry';

import { CommentIndicator, DragTarget, ThreadEditor } from './components';
import { useThreadHandlers, useThreadInstance } from './hooks';

const CommentThread: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const focusThread = React.useContext(FocusThreadContext)!;
  const threadEntity = React.useContext(ThreadEntityContext)!;
  const instance = useThreadInstance<HTMLDivElement>();
  const { commentCount, isFocused } = threadEntity.useState((e) => ({
    commentCount: e.resolve().comments.length,
    isFocused: e.isFocused,
  }));

  const { onDoubleClick, ...handlers } = useThreadHandlers({
    drag: (movement) => instance.translate(engine.canvas!.toVector(movement)),
    drop: () => engine.comment.dropThread(threadEntity.threadID),
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
      <CommentIndicator draggable tabIndex={-1} {...handlers} isFocused={isFocused}>
        {commentCount}
      </CommentIndicator>
      {isFocused && <ThreadEditor />}
    </DragTarget>
  );
};

export default React.memo(CommentThread);
