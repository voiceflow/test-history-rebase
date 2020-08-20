import React from 'react';

import { Comment, Thread } from '@/models';
import { FadeDownDelayedContainer } from '@/styles/animations';
import { preventDefault, stopPropagation } from '@/utils/dom';

import { CommentEditor, Container, NewComment, ReplySection } from './components';

export type ThreadEditorProps = {
  thread?: Thread;
};

const ThreadEditor: React.FC<ThreadEditorProps> = ({ thread }) => (
  <Container draggable onDragStart={preventDefault()} onMouseDown={stopPropagation(null, true)} onClick={preventDefault()}>
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
);

export default ThreadEditor;
