import React from 'react';

import DragTarget from '@/pages/Canvas/components/DragTarget';
import { EngineContext, FocusThreadContext, ThreadEntityContext } from '@/pages/Canvas/contexts';
import { ClassName } from '@/styles/constants';

import { CommentIndicator, ThreadEditor } from './components';
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
    drag: (movement) => engine.comment.dragThread(threadEntity.threadID, movement),
    mousedown: () => engine.comment.setTarget(threadEntity.threadID),
    mouseup: () => engine.comment.setTarget(null),
    click: async () => {
      if (threadEntity.isFocused) {
        focusThread?.resetFocus();
      } else {
        await focusThread.setFocus(threadEntity.threadID);
      }
    },
    doubleClick: () => engine.comment.centerThread(threadEntity.threadID),
  });

  threadEntity.useInstance(instance);

  return (
    <DragTarget
      isTransform
      onDoubleClick={onDoubleClick}
      className={ClassName.CANVAS_THREAD}
      data-thread-id={threadEntity.threadID}
      position={instance.getPosition()}
      ref={instance.ref}
      zIndex={isFocused ? 10 : undefined}
    >
      <CommentIndicator draggable tabIndex={-1} {...handlers}>
        {commentCount}
      </CommentIndicator>
      {isFocused && <ThreadEditor />}
    </DragTarget>
  );
};

export default React.memo(CommentThread);
