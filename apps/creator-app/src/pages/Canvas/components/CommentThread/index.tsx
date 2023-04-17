import composeRef from '@seznam/compose-react-refs';
import { Popper } from '@voiceflow/ui';
import React from 'react';

import { EngineContext, FocusThreadContext, ThreadEntityContext } from '@/pages/Canvas/contexts';
import { ClassName } from '@/styles/constants';

import { CANVAS_THREAD_OPEN_CLASSNAME } from '../../constants';
import { CommentIndicator, DragTarget, ThreadEditor } from './components';
import { INDICATOR_DIAMETER } from './constants';
import { useThreadHandlers, useThreadInstance } from './hooks';

const CommentThread: React.FC<{ isHidden?: boolean }> = ({ isHidden }) => {
  const engine = React.useContext(EngineContext)!;
  const focusThread = React.useContext(FocusThreadContext)!;
  const threadEntity = React.useContext(ThreadEntityContext)!;

  const instance = useThreadInstance<HTMLDivElement>();

  const { isFocused } = threadEntity.useState((e) => ({ isFocused: e.isFocused }));

  const { onDoubleClick, ...handlers } = useThreadHandlers({
    drag: (movement) => engine.comment.dragThread(threadEntity.threadID, engine.canvas!.toVector(movement)),
    drop: () => engine.comment.dropThread(),
    mousedown: () => engine.comment.setTarget(threadEntity.threadID),
    mouseup: () => engine.comment.setTarget(null),
    click: async () => {
      if (threadEntity.isFocused) {
        focusThread.resetFocus({ syncURL: true });
      } else {
        focusThread.setFocus(threadEntity.threadID);
      }
    },
    doubleClick: () => engine.comment.centerThread(threadEntity.threadID),
  });

  React.useEffect(() => {
    if (!isFocused) return undefined;

    engine.addClass(CANVAS_THREAD_OPEN_CLASSNAME);

    // to prevent popper from closing on click outside the popper
    const onMouseDown = (event: MouseEvent) => event.stopImmediatePropagation();
    document.body.addEventListener('click', onMouseDown);

    return () => {
      engine.removeClass(CANVAS_THREAD_OPEN_CLASSNAME);

      document.body.removeEventListener('click', onMouseDown);
    };
  }, [isFocused]);

  threadEntity.useInstance(instance);

  const origin = instance.getCoords().map(engine.canvas!.getOuterPlane());

  return (
    <Popper
      width="350px"
      zIndex={20}
      opened={isFocused && !isHidden}
      modifiers={{ offset: { offset: `${-INDICATOR_DIAMETER / 2},${INDICATOR_DIAMETER / 2 + 14}` } }}
      placement="right-start"
      disableLayers
      renderContent={({ scheduleUpdate }) => <ThreadEditor replyRef={instance.commentRef} schedulePopperUpdate={scheduleUpdate} />}
    >
      {({ ref }) => (
        <DragTarget
          ref={composeRef(ref, instance.ref)}
          zIndex={isFocused ? 10 : undefined}
          position={origin}
          className={ClassName.CANVAS_THREAD}
          isTransform
          onDoubleClick={onDoubleClick}
          data-thread-id={threadEntity.threadID}
        >
          <CommentIndicator className={`${ClassName.CANVAS_THREAD}__indicator`} draggable tabIndex={-1} {...handlers} isFocused={isFocused}>
            {threadEntity.threadOrder}
          </CommentIndicator>
        </DragTarget>
      )}
    </Popper>
  );
};

export default React.memo(CommentThread);
