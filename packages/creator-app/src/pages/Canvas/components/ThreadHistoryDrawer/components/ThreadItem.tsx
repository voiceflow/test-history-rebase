import { Box, BoxFlexApart, Flex, IconButton, IconButtonVariant, SvgIcon, Text, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import Commenter from '@/components/Commenter';
import CommentPreview from '@/components/CommentPreview';
import Duration from '@/components/Duration';
import { Thread as ThreadType } from '@/models';
import { EngineContext, FocusThreadContext } from '@/pages/Canvas/contexts';

import ItemContainer from './ItemContainer';

type ThreadItemProps = ThreadType;

const ThreadItem: React.FC<ThreadItemProps> = ({ id: threadID, resolved, comments }) => {
  const engine = React.useContext(EngineContext)!;
  const focusThread = React.useContext(FocusThreadContext)!;

  const comment = comments[0];
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
        <Commenter creatorID={comment.creatorID} />
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
        <CommentPreview text={comment.text} />
      </Box>
      <BoxFlexApart>
        <Duration key={threadID} time={comment.created} />
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

export default ThreadItem;
