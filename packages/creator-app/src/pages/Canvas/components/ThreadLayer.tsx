import React from 'react';

import { RemoveIntercom } from '@/components/IntercomChat';
import * as Thread from '@/ducks/thread';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useDispatch, useHotKeys, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';
import CommentThread from '@/pages/Canvas/components/CommentThread';
import { EngineContext, FocusThreadContext, ThreadEntityProvider } from '@/pages/Canvas/contexts';
import { CanvasRenderGate } from '@/pages/Canvas/gates';
import { useCanvasIdle, useCanvasPan, useCanvasZoom } from '@/pages/Canvas/hooks';
import { useCommentingMode } from '@/pages/Project/hooks';
import { ConnectedProps } from '@/types';

import NewCommentThread from './NewCommentThread';

const ThreadLayer: React.FC<ConnectedThreadLayerProps> = ({ threadIDs, updateUnreadComments }) => {
  const engine = React.useContext(EngineContext)!;
  const focusThread = React.useContext(FocusThreadContext)!;
  const [isCanvasMoving, setIsCanvasMoving] = React.useState<boolean>(false);
  const [trackEvents] = useTrackingEvents();
  const isCommentingMode = useCommentingMode();

  const commentsVisible = useSelector(UI.isCommentsVisible);
  const toggleCommentVisibility = useDispatch(UI.toggleCommentVisibility);

  const prevMoving = React.useRef(isCanvasMoving);
  const containerKey = React.useRef(0);

  useHotKeys(Hotkey.HIDE_COMMENT_BUBBLES, toggleCommentVisibility);

  useCanvasIdle(() => {
    setIsCanvasMoving(false);
  });

  useCanvasPan(() => {
    setIsCanvasMoving(true);
  });

  useCanvasZoom(() => {
    setIsCanvasMoving(true);
  });

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
  if (prevMoving.current === true && !isCanvasMoving) {
    containerKey.current++;
  }

  prevMoving.current = isCanvasMoving;

  return (
    <div key={containerKey.current} style={{ visibility: isCanvasMoving ? 'hidden' : 'visible' }}>
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

const mapStateToProps = {
  threadIDs: Thread.activeDiagramThreadIDsSelector,
};

const mapDispatchToProps = {
  updateUnreadComments: Thread.updateUnreadComments,
};

type ConnectedThreadLayerProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ThreadLayer);
