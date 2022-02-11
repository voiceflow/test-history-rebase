import { preventDefault, stopPropagation } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';
import { DismissableLayerProvider } from 'react-dismissable-layers';

import { useOnClickOutside } from '@/hooks';
import { Comment, Thread } from '@/models';
import { FocusThreadContext } from '@/pages/Canvas/contexts';
import { useCommentingMode } from '@/pages/Project/hooks';
import { FadeDownDelayedContainer } from '@/styles/animations';
import { ClassName } from '@/styles/constants';

import { CommentEditor, Container, NewComment, ReplySection } from './components';
import { NEW_THREAD_EDITOR } from './constants';

export interface ThreadEditorProps {
  thread?: Thread;
  isFocused: boolean;
}

const ThreadEditor: React.FC<ThreadEditorProps> = ({ isFocused, thread }) => {
  const ref = React.useRef(null);
  const focusThread = React.useContext(FocusThreadContext)!;
  const isCommentingMode = useCommentingMode();

  useOnClickOutside(
    ref,
    () => {
      if (!isCommentingMode && isFocused) {
        focusThread.resetFocus();
      }
    },
    [isFocused, isCommentingMode]
  );

  return (
    <DismissableLayerProvider>
      <Container
        ref={ref}
        draggable
        className={cn(ClassName.THREAD_EDITOR, { [NEW_THREAD_EDITOR]: !thread })}
        onDragStart={preventDefault()}
        onMouseDown={stopPropagation(null, true)}
      >
        <FadeDownDelayedContainer>
          {thread ? (
            <>
              {thread.comments.map((comment: Comment, index: number) => (
                <CommentEditor key={comment.id} comment={comment} showResolve={index === 0} />
              ))}
              <ReplySection threadID={thread.id} />
            </>
          ) : (
            <NewComment />
          )}
        </FadeDownDelayedContainer>
      </Container>
    </DismissableLayerProvider>
  );
};

export default ThreadEditor;
