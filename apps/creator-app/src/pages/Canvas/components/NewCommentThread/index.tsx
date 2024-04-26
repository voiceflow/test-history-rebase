import { Popper } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import { Designer } from '@/ducks';
import { useLinkedRef, useRegistration } from '@/hooks';
import { CommentIndicator } from '@/pages/Canvas/components/CommentThread/components';
import { INDICATOR_DIAMETER } from '@/pages/Canvas/components/CommentThread/constants';
import { useThreadHandlers } from '@/pages/Canvas/components/CommentThread/hooks';
import DragTarget from '@/pages/Canvas/components/DragTarget';
import ThreadEditor from '@/pages/Canvas/components/ThreadEditor';
import { CANVAS_THREAD_OPEN_CLASSNAME } from '@/pages/Canvas/constants';
import { EngineContext } from '@/pages/Canvas/contexts';

import { useNewCommentAPI } from './hooks';

const NewCommentThread: React.FC<{ isHidden?: boolean }> = ({ isHidden }) => {
  const api = useNewCommentAPI();
  const originRef = useLinkedRef(api.origin);
  const engine = React.useContext(EngineContext)!;
  const threadCount = useSelector(Designer.Thread.selectors.countForActiveDiagram);

  const handlers = useThreadHandlers(
    {
      drag: (movement) => {
        if (!originRef.current) return;

        const nextOrigin = originRef.current.add(movement, engine.canvas!.getPlane());

        api.show(nextOrigin);
        engine.comment.updateCandidates(nextOrigin);
      },
      click: () => engine.comment.resetCreating(),
    },
    []
  );

  useRegistration(() => engine.comment.register('newComment', api), [api]);

  React.useEffect(() => {
    if (!api.origin) return undefined;

    engine.addClass(CANVAS_THREAD_OPEN_CLASSNAME);

    return () => engine.removeClass(CANVAS_THREAD_OPEN_CLASSNAME);
  }, [api.origin]);

  if (!api.origin) return null;

  const origin = api.origin.map(engine.canvas!.getOuterPlane());

  return (
    <Popper
      width="350px"
      opened={!isHidden}
      zIndex={21}
      modifiers={{
        offset: { offset: `${-INDICATOR_DIAMETER / 2},${INDICATOR_DIAMETER / 2 + 14}` },
        preventOverflow: { padding: { top: 72, bottom: 16, left: 16, right: 16 } },
      }}
      placement="right-start"
      renderContent={({ scheduleUpdate }) => (
        <ThreadEditor replyRef={api.commentRef} isFocused schedulePopperUpdate={scheduleUpdate} />
      )}
      disableLayers
    >
      {({ ref }) => (
        <DragTarget ref={ref} position={origin} zIndex={10}>
          <CommentIndicator draggable tabIndex={-1} {...handlers}>
            {threadCount + 1}
          </CommentIndicator>
        </DragTarget>
      )}
    </Popper>
  );
};

export default React.memo(NewCommentThread);
