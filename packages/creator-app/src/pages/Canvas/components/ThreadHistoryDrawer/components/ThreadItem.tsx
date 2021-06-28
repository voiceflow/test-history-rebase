import { Box, BoxFlexApart, Flex, IconButton, IconButtonVariant, SvgIcon, Text, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import Commenter from '@/components/Commenter';
import CommentPreview from '@/components/CommentPreview';
import Duration from '@/components/Duration';
import * as Workspace from '@/ducks/workspace';
import { UNKNOWN_MEMBER_DATA } from '@/ducks/workspace';
import { connect } from '@/hocs';
import { Thread as ThreadType } from '@/models';
import { EngineContext, FocusThreadContext } from '@/pages/Canvas/contexts';
import { ConnectedProps, MergeArguments } from '@/types';

import ItemContainer from './ItemContainer';

type ThreadItemProps = ThreadType;

const ThreadItem: React.FC<ThreadItemProps & ConnectedThreadItemProps> = ({ id: threadID, resolved, comments, user }) => {
  const engine = React.useContext(EngineContext)!;
  const focusThread = React.useContext(FocusThreadContext)!;

  const { text, created } = comments[0];

  const hasReplies = comments.length - 1;
  const hasMultipleReplies = comments.length > 2;

  const onClick = React.useCallback(async () => {
    if (focusThread.focusedID === threadID) {
      focusThread.resetFocus();
    } else {
      await engine.comment.centerThread(threadID);
      await focusThread.setFocus(threadID);
    }
  }, [focusThread.focusedID, threadID]);

  return (
    <ItemContainer isFocused={focusThread.focusedID === threadID} onClick={onClick}>
      <BoxFlexApart height={42}>
        <Commenter creatorID={user?.creator_id || UNKNOWN_MEMBER_DATA.creator_id} />
        {resolved && (
          <TippyTooltip title="Mark Unresolved" distance={1}>
            <IconButton
              size={16}
              icon="filledCheck"
              variant={IconButtonVariant.SUBTLE}
              onClick={() => engine.comment.unresolveThread(threadID)}
              iconProps={{ color: '#becedc' }}
              hoverColor="#6e849a"
            />
          </TippyTooltip>
        )}
      </BoxFlexApart>
      <Box p="12px 0">
        <CommentPreview text={text} />
      </Box>
      <BoxFlexApart>
        <Duration key={threadID} time={created} />
        {!!hasReplies && (
          <Flex>
            <Text color="#8da2b5" mr={8} fontSize={13}>
              {hasReplies} {hasMultipleReplies ? 'replies' : 'reply'}
            </Text>
            <SvgIcon icon="forward" size={14} color="#8da2b5" />
          </Flex>
        )}
      </BoxFlexApart>
    </ItemContainer>
  );
};

const mapStateToProps = {
  user: Workspace.anyWorkspaceMemberSelector,
};

const mergeProps = (...[{ user: userSelector }, , { comments }]: MergeArguments<typeof mapStateToProps, {}, ThreadItemProps>) => ({
  user: userSelector(String(comments[0].creatorID))!,
});

export type ConnectedThreadItemProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default connect(mapStateToProps, null, mergeProps)(ThreadItem as any) as React.FC<ThreadItemProps>;
