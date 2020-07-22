import React from 'react';

import Box from '@/components/Box';
import CommentPreview from '@/components/CommentPreview';
import Commenter from '@/components/Commenter';
import Duration from '@/components/Duration';
import Flex, { FlexApart } from '@/components/Flex';
import SvgIcon from '@/components/SvgIcon';
import Text from '@/components/Text';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { Thread as ThreadType } from '@/models';
import { ConnectedProps, MergeArguments } from '@/types';

import ItemContainer from './ItemContainer';

type ThreadItemProps = ThreadType & {
  isFocused?: boolean;
};

const ThreadItem: React.FC<ThreadItemProps & ConnectedThreadItemProps> = ({ comments, user, isFocused = false }) => {
  const { text, created } = comments[0];

  const hasReplies = comments.length - 1;

  return (
    <ItemContainer isFocused={isFocused}>
      <Commenter creatorID={user.creator_id} />
      <Box p="12px 0">
        <CommentPreview text={text} />
      </Box>
      <FlexApart>
        <Duration time={created} />
        {!!hasReplies && (
          <Flex>
            <Text color="#8da2b5" mr={8} fontSize={13}>
              {hasReplies} reply
            </Text>
            <SvgIcon icon="forward" size={14} color="#8da2b5" />
          </Flex>
        )}
      </FlexApart>
    </ItemContainer>
  );
};

const mapStateToProps = {
  user: Workspace.workspaceMemberSelector,
};

const mergeProps = (...[{ user: userSelector }, , { comments }]: MergeArguments<typeof mapStateToProps, {}, ThreadItemProps>) => ({
  user: userSelector(String(comments[0].creatorID))!,
});

export type ConnectedThreadItemProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default connect(mapStateToProps, null, mergeProps)(ThreadItem as any) as React.FC<ThreadItemProps>;
