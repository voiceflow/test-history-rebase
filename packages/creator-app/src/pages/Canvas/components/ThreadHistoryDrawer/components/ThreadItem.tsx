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

  const containerRef = React.useRef<HTMLDivElement>(null);

  const comment = comments[0];
  const isFocused = focusThread.focusedID === threadID;
  const hasReplies = comments.length - 1;
  const hasMultipleReplies = comments.length > 2;

  const onClick = () => {
    if (isFocused) {
      focusThread.resetFocus({ syncURL: true });
    } else {
      focusThread.setFocus(threadID, { center: true });
    }
  };

  React.useEffect(() => {
    if (!isFocused) return;

    containerRef.current?.scrollIntoView({ block: 'nearest' });
  }, [isFocused]);

  return (
    <ItemContainer ref={containerRef} isFocused={isFocused} onClick={onClick}>
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
