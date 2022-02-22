import React from 'react';

import { RemoveIntercom } from '@/components/IntercomChat';
import { AutoPanningStateContext } from '@/contexts';
import * as Thread from '@/ducks/thread';
import * as UI from '@/ducks/ui';
import { useDispatch, useHotKeys, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';
import CommentThread from '@/pages/Canvas/components/CommentThread';
import { EngineContext, FocusThreadContext, ThreadEntityProvider } from '@/pages/Canvas/contexts';
import { CanvasRenderGate } from '@/pages/Canvas/gates';
import { useCanvasIdle, useCanvasPan, useCanvasZoom } from '@/pages/Canvas/hooks';
import { useCommentingMode } from '@/pages/Project/hooks';

import NewCommentThread from './NewCommentThread';

const ThreadLayer: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const focusThread = React.useContext(FocusThreadContext)!;
  const isAutoPanning = React.useContext(AutoPanningStateContext);

  const [trackEvents] = useTrackingEvents();
  const isCommentingMode = useCommentingMode();

  const threadIDs = useSelector(Thread.activeDiagramThreadIDsSelector);
  const commentsVisible = useSelector(UI.isCommentsVisible);

  const updateUnreadComments = useDispatch(Thread.updateUnreadComments);
  const toggleCommentVisibility = useDispatch(UI.toggleCommentVisibility);

  const [isCanvasMoving, setIsCanvasMoving] = React.useState<boolean>(false);

  const isHidden = isCanvasMoving || isAutoPanning;

  const prevIsHidden = React.useRef(isHidden);
  const containerKey = React.useRef(0);

  useHotKeys(Hotkey.HIDE_COMMENT_BUBBLES, toggleCommentVisibility);
  useCanvasPan(() => setIsCanvasMoving(true));
  useCanvasZoom(() => setIsCanvasMoving(true));
  useCanvasIdle(() => setIsCanvasMoving(false));

  React.useEffect(() => {
    updateUnreadComments(false);

    if (!isCommentingMode) {
      focusThread.resetFocus();
      engine.comment.reset();
      engine.comment.resetDraftComment();
    } else {
      trackEvents.trackCommentingOpen();
    }
  }, [isCommentingMode]);

  if (!commentsVisible && !isCommentingMode) return null;

  // incrementing the container key will cause the layer to re-render/re-position the bubbles
  // incrementing only after movement is finished to reduce the rerenders
  if (prevIsHidden.current === true && !isHidden) {
    containerKey.current++;
  }

  prevIsHidden.current = isHidden;

  return (
    <div key={containerKey.current} style={{ visibility: isHidden ? 'hidden' : 'visible' }}>
      {threadIDs.map((threadID) => (
        <ThreadEntityProvider id={threadID} key={threadID}>
          <CanvasRenderGate>
            <CommentThread />
          </CanvasRenderGate>
        </ThreadEntityProvider>
      ))}
      <NewCommentThread />
      <RemoveIntercom />
    </div>
  );
};

export default React.memo(ThreadLayer);
