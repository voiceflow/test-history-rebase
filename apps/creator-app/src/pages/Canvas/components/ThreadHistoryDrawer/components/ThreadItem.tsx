import { Thread } from '@voiceflow/dtos';
import { Box, Flex, IconButton, IconButtonVariant, Text, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import Commenter from '@/components/Commenter';
import CommentPreview from '@/components/CommentPreview';
import Duration from '@/components/Duration';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks';
import { EngineContext, FocusThreadContext } from '@/pages/Canvas/contexts';

import ItemContainer from './ItemContainer';

interface ThreadItemProps {
  thread: Thread;
}

const ThreadItem: React.FC<ThreadItemProps> = ({ thread }) => {
  const engine = React.useContext(EngineContext)!;
  const focusThread = React.useContext(FocusThreadContext)!;

  const comments = useSelector(Designer.Thread.ThreadComment.selectors.getAllByThreadID)({ threadID: thread.id });

  const containerRef = React.useRef<HTMLDivElement>(null);

  const comment = comments[0];
  const isFocused = focusThread.focusedID === thread.id;
  const hasReplies = comments.length - 1;
  const hasMultipleReplies = comments.length > 2;

  const onClick = () => {
    if (isFocused) {
      focusThread.resetFocus({ syncURL: true });
    } else {
      focusThread.setFocus(thread.id, { center: true });
    }
  };

  React.useEffect(() => {
    if (!isFocused) return;

    containerRef.current?.scrollIntoView({ block: 'nearest' });
  }, [isFocused]);

  if (!comment) {
    return null;
  }

  return (
    <ItemContainer ref={containerRef} isFocused={isFocused} onClick={onClick}>
      <Box.FlexApart height={42}>
        <Commenter creatorID={comment.authorID} />

        {thread.resolved && (
          <TippyTooltip content="Mark Unresolved" offset={[0, 1]}>
            <IconButton
              size={16}
              icon="checkmarkFilled"
              variant={IconButtonVariant.SUBTLE}
              onClick={() => engine.comment.unresolveThread(thread.id)}
              iconProps={{ color: '#becedc' }}
              hoverColor="#6e849a"
            />
          </TippyTooltip>
        )}
      </Box.FlexApart>

      <Box p="12px 0">
        <CommentPreview text={comment.text} />
      </Box>

      <Box.FlexApart>
        <Duration time={comment.created} color={isFocused ? '#6e849a' : '#8da2b5'} />

        {!!hasReplies && (
          <Flex>
            <Text color={isFocused ? '#6e849a' : '#8da2b5'} fontSize={13}>
              {hasReplies} {hasMultipleReplies ? 'replies' : 'reply'}
            </Text>
          </Flex>
        )}
      </Box.FlexApart>
    </ItemContainer>
  );
};

export default ThreadItem;
