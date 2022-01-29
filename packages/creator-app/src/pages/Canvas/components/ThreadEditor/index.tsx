import { preventDefault, stopPropagation } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';
import { DismissableLayerProvider } from 'react-dismissable-layers';

import { Comment, Thread } from '@/models';
import { FadeDownDelayedContainer } from '@/styles/animations';
import { ClassName } from '@/styles/constants';

import { CommentEditor, Container, NewComment, ReplySection } from './components';
import { NEW_THREAD_EDITOR } from './constants';

export interface ThreadEditorProps {
  thread?: Thread;
}

const ThreadEditor: React.FC<ThreadEditorProps> = ({ thread }) => (
  <DismissableLayerProvider>
    <Container
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

export default ThreadEditor;
