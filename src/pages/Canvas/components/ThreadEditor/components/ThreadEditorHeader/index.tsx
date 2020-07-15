import React from 'react';

import { Flex } from '@/components/Box';
import Commenter from '@/components/Commenter';
import * as Account from '@/ducks/account';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import CommentActions, { CommentActionsProps } from './CommentActions';

type ThreadEditorHeaderProps = CommentActionsProps & {};

const ThreadEditorHeader: React.FC<ThreadEditorHeaderProps & ConnectedThreadEditorHeaderProps> = ({ currentUser, ...actionProps }) => {
  return (
    <Flex justifyContent="space-between" height={33}>
      <Commenter creatorID={currentUser.creator_id!} />
      <CommentActions currentUser={currentUser.creator_id!} {...actionProps} />
    </Flex>
  );
};

const mapStateToProps = {
  currentUser: Account.userSelector,
};

type ConnectedThreadEditorHeaderProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(ThreadEditorHeader as any) as React.FC<ThreadEditorHeaderProps>;
