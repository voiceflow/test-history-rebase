import React from 'react';

import * as Thread from '@/ducks/thread';
import { connect } from '@/hocs';
import CommentThread from '@/pages/Canvas/components/CommentThread';
import { ThreadEntityProvider } from '@/pages/Canvas/contexts';
import { useCommentingMode } from '@/pages/Skill/hooks';
import { ConnectedProps } from '@/types';

import NewCommentThread from './NewCommentThread';

const ThreadLayer: React.FC<ConnectedThreadLayerProps> = ({ rootThreadIDs }) => {
  const isCommentingMode = useCommentingMode();

  if (!isCommentingMode) return null;

  return (
    <>
      {rootThreadIDs.map((threadID) => (
        <ThreadEntityProvider id={threadID} key={threadID}>
          <CommentThread />
        </ThreadEntityProvider>
      ))}
      <NewCommentThread />
    </>
  );
};

const mapStateToProps = {
  rootThreadIDs: Thread.rootThreadIDsSelector,
};

type ConnectedThreadLayerProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(ThreadLayer);
