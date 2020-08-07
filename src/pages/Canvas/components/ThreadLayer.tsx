import React from 'react';

import * as Thread from '@/ducks/thread';
import { connect } from '@/hocs';
import CommentThread from '@/pages/Canvas/components/CommentThread';
import { ThreadEntityProvider } from '@/pages/Canvas/contexts';
import { CanvasRenderGate } from '@/pages/Canvas/gates';
import { useCommentingMode } from '@/pages/Skill/hooks';
import { ConnectedProps } from '@/types';

import NewCommentThread from './NewCommentThread';

const ThreadLayer: React.FC<ConnectedThreadLayerProps> = ({ rootThreadIDs, updateUnreadComments }) => {
  const isCommentingMode = useCommentingMode();

  React.useEffect(() => {
    updateUnreadComments(false);
  }, [isCommentingMode]);

  if (!isCommentingMode) return null;

  return (
    <>
      {rootThreadIDs.map((threadID) => (
        <ThreadEntityProvider id={threadID} key={threadID}>
          <CanvasRenderGate>
            <CommentThread />
          </CanvasRenderGate>
        </ThreadEntityProvider>
      ))}
      <NewCommentThread />
    </>
  );
};

const mapStateToProps = {
  rootThreadIDs: Thread.activeDiagramRootThreadIDsSelector,
};

const mapDispatchToProps = {
  updateUnreadComments: Thread.updateUnreadComments,
};

type ConnectedThreadLayerProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ThreadLayer);
