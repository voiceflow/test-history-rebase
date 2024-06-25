import { Box } from '@voiceflow/ui';
import React from 'react';

import Commenter from '@/components/Commenter';
import * as Account from '@/ducks/account';
import { useSelector } from '@/hooks';

import type { CommentActionsProps } from './CommentActions';
import CommentActions from './CommentActions';

export interface ThreadEditorHeaderProps extends Omit<CommentActionsProps, 'currentUserID'> {}

const ThreadEditorHeader: React.FC<ThreadEditorHeaderProps> = ({ comment, ...actionProps }) => {
  const userID = useSelector(Account.userIDSelector)!;

  return (
    <Box.Flex justifyContent="space-between" height={32}>
      {comment ? <Commenter creatorID={comment.authorID} time={comment.created} /> : <Commenter creatorID={userID} />}
      <CommentActions comment={comment} currentUserID={userID} {...actionProps} />
    </Box.Flex>
  );
};

export default ThreadEditorHeader;
