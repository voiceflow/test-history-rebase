import React from 'react';

import client from '@/client';
import * as Thread from '@/ducks/thread';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

const CommentingUpdates: React.FC<ConnectedCommentingUpdatesProps> = ({
  addThread,
  updateThread,
  deleteThread,
  addNewReply,
  updateComment,
  deleteComment,
}) => {
  React.useEffect(() => client.socket.project.watchForNewThread(addThread), [addThread]);

  React.useEffect(() => client.socket.project.watchForThreadUpdate(updateThread), [updateThread]);

  React.useEffect(() => client.socket.project.watchForThreadDelete(deleteThread), [deleteThread]);

  React.useEffect(() => client.socket.project.watchForNewReply(addNewReply), [addNewReply]);

  React.useEffect(() => client.socket.project.watchForCommentUpdate(updateComment), [updateComment]);

  React.useEffect(() => client.socket.project.watchForCommentDelete(deleteComment), [deleteComment]);

  return null;
};

const mapDispatchToProps = {
  addThread: Thread.handleNewThread,
  updateThread: Thread.handleThreadUpdate,
  deleteThread: Thread.handleThreadDelete,
  addNewReply: Thread.handleNewReply,
  updateComment: Thread.handleCommentUpdate,
  deleteComment: Thread.handleCommentDelete,
};

type ConnectedCommentingUpdatesProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(CommentingUpdates);
