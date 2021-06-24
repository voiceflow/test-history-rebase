import { BoxFlex } from '@voiceflow/ui';
import React from 'react';

import Commenter from '@/components/Commenter';
import * as Account from '@/ducks/account';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import CommentActions, { CommentActionsProps } from './CommentActions';

export type ThreadEditorHeaderProps = CommentActionsProps & {
  postedTime?: string;
};

const ThreadEditorHeader: React.FC<ThreadEditorHeaderProps & ConnectedThreadEditorHeaderProps> = ({ currentUser, postedTime, ...actionProps }) => (
  <BoxFlex justifyContent="space-between" height={33}>
    <Commenter creatorID={actionProps.creatorID || currentUser.creator_id!} time={postedTime} />
    <CommentActions currentUser={currentUser.creator_id!} {...actionProps} />
  </BoxFlex>
);

const mapStateToProps = {
  currentUser: Account.userSelector,
};

type ConnectedThreadEditorHeaderProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(ThreadEditorHeader as any) as React.FC<ThreadEditorHeaderProps>;
