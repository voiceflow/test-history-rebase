import cn from 'classnames';
import React from 'react';

import { Comment, Thread } from '@/models';
import { FadeDownDelayedContainer } from '@/styles/animations';
import { ClassName } from '@/styles/constants';
import { preventDefault, stopPropagation } from '@/utils/dom';

import { CommentEditor, Container, NewComment, ReplySection } from './components';
import { NEW_THREAD_EDITOR } from './constants';

export type ThreadEditorProps = {
  thread?: Thread;
};

const ThreadEditor: React.FC<ThreadEditorProps> = ({ thread }) => (
  <Container
    className={cn(ClassName.THREAD_EDITOR, { [NEW_THREAD_EDITOR]: !thread })}
    draggable
    onDragStart={preventDefault()}
    onMouseDown={stopPropagation(null, true)}
    onClick={preventDefault()}
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
);

export default ThreadEditor;
