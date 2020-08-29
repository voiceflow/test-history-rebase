import React from 'react';

import { RemoveIntercom } from '@/components/IntercomChat';
import * as Thread from '@/ducks/thread';
import { connect } from '@/hocs';
import CommentThread from '@/pages/Canvas/components/CommentThread';
import { EngineContext, FocusThreadContext, ThreadEntityProvider } from '@/pages/Canvas/contexts';
import { CanvasRenderGate } from '@/pages/Canvas/gates';
import { useCommentingMode } from '@/pages/Skill/hooks';
import { ConnectedProps } from '@/types';

import NewCommentThread from './NewCommentThread';

const ThreadLayer: React.FC<ConnectedThreadLayerProps> = ({ threadIDs, updateUnreadComments }) => {
  const engine = React.useContext(EngineContext)!;
  const isCommentingMode = useCommentingMode();
  const focusThread = React.useContext(FocusThreadContext)!;

  React.useEffect(() => {
    updateUnreadComments(false);
    if (!isCommentingMode) {
      focusThread.resetFocus();
      engine.comment.reset();
    }
  }, [isCommentingMode]);

  if (!isCommentingMode) return null;

  return (
    <>
      {threadIDs.map((threadID) => (
        <ThreadEntityProvider id={threadID} key={threadID}>
          <CanvasRenderGate>
            <CommentThread />
          </CanvasRenderGate>
        </ThreadEntityProvider>
      ))}
      <NewCommentThread />
      <RemoveIntercom />
    </>
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
