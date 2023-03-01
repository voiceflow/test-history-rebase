import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { AutoPanningStateContext } from '@/contexts/AutoPanningContext';
import * as Thread from '@/ducks/threadV2';
import * as UI from '@/ducks/ui';
import { useDispatch, useHotkey, useRAF, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';
import CommentThread from '@/pages/Canvas/components/CommentThread';
import { EngineContext, FocusThreadContext, ThreadEntityProvider } from '@/pages/Canvas/contexts';
import { CanvasRenderGate } from '@/pages/Canvas/gates';
import { useCanvasIdle, useCanvasPan, useCanvasZoom } from '@/pages/Canvas/hooks/canvas';
import { CommentDraftValue } from '@/pages/Canvas/types';
import { useCommentingMode } from '@/pages/Project/hooks';
import { Coords } from '@/utils/geometry';

import NewCommentThread from './NewCommentThread';

const ThreadLayer: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const focusThread = React.useContext(FocusThreadContext)!;
  const isAutoPanning = React.useContext(AutoPanningStateContext);

  const [scheduler, schedulerAPI] = useRAF();
  const [trackEvents] = useTrackingEvents();
  const isCommentingMode = useCommentingMode();

  const threadIDs = useSelector(Thread.activeDiagramThreadIDsSelector);
  const commentsVisible = useSelector(UI.isCommentsVisible);

  const updateUnreadComments = useDispatch(Realtime.thread.comment.updateUnreadComments);
  const toggleCommentVisibility = useDispatch(UI.toggleCommentVisibility);

  const [isCanvasMoving, setIsCanvasMoving] = React.useState<boolean>(false);

  const isHidden = isCanvasMoving || isAutoPanning;

  const prevIsHidden = React.useRef(isHidden);
  const containerKey = React.useRef(0);
  const newCommentOriginRef = React.useRef<Coords | null>(null);
  const newCommentDraftValue = React.useRef<CommentDraftValue | null>(null);
  const focusedCommentDraftValue = React.useRef<CommentDraftValue | null>(null);

  useHotkey(Hotkey.HIDE_COMMENT_BUBBLES, toggleCommentVisibility);

  useCanvasPan((movement) => {
    newCommentOriginRef.current ??= engine.comment.getNewOrigin();
    newCommentDraftValue.current ??= engine.comment.getNewDraftValue();
    focusedCommentDraftValue.current ??= engine.comment.getFocusedDraftValue();

    if (newCommentOriginRef.current) {
      newCommentOriginRef.current = newCommentOriginRef.current.add(movement, Coords.WINDOW_PLANE);
    }

    setIsCanvasMoving(true);
  });

  useCanvasZoom((calculateMovement) => {
    newCommentOriginRef.current ??= engine.comment.getNewOrigin();
    newCommentDraftValue.current ??= engine.comment.getNewDraftValue();
    focusedCommentDraftValue.current ??= engine.comment.getFocusedDraftValue();

    if (newCommentOriginRef.current && engine.canvas) {
      const outerPlane = engine.canvas.getOuterPlane();
      const [moveX, moveY] = calculateMovement(newCommentOriginRef.current.map(outerPlane));

      newCommentOriginRef.current = newCommentOriginRef.current.add([moveX, moveY], outerPlane);
    }

    setIsCanvasMoving(true);
  });

  useCanvasIdle(() => {
    setIsCanvasMoving(false);
  });

  React.useEffect(() => {
    if (isHidden) return undefined;

    if (newCommentOriginRef.current) {
      engine.comment.renewThread(newCommentOriginRef.current);
      newCommentOriginRef.current = null;
    }

    const newDraftVal = newCommentDraftValue.current;
    const focusedDraftVal = focusedCommentDraftValue.current;

    newCommentDraftValue.current = null;
    focusedCommentDraftValue.current = null;

    scheduler(() => {
      if (newDraftVal) {
        engine.comment.setNewDraftValue(newDraftVal);
      } else if (focusedDraftVal) {
        engine.comment.setFocusedDraftValue(focusedDraftVal);
      }
    });

    return () => schedulerAPI.current.cancel();
  }, [isHidden]);

  React.useEffect(() => {
    if (!isCommentingMode) {
      focusThread.resetFocus();
    } else {
      updateUnreadComments(false);
      trackEvents.trackCommentingOpen();
    }
  }, [isCommentingMode]);

  React.useEffect(() => {
    newCommentOriginRef.current = null;
    newCommentDraftValue.current = null;
  }, [focusThread.focusedID]);

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
            <CommentThread isHidden={isHidden} />
          </CanvasRenderGate>
        </ThreadEntityProvider>
      ))}

      <NewCommentThread isHidden={isHidden} />
    </div>
  );
};

export default React.memo(ThreadLayer);
