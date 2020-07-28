import React from 'react';

import { Comment, Thread } from '@/models';
import { Either, Point } from '@/types';
import { preventDefault, stopPropagation } from '@/utils/dom';

import { CommentEditor, Container, NewComment, ReplySection } from './components';

export type ThreadEditorProps = Either<
  {
    thread: Thread;
  },
  {
    origin: Point;
  }
>;

const ThreadEditor: React.FC<ThreadEditorProps> = ({ origin, thread }) => {
  if (thread) {
    return (
      <Container draggable onDragStart={preventDefault()} onMouseDown={stopPropagation(null, true)} onClick={preventDefault()}>
        {thread.comments.map((comment: Comment, index: number) => (
          <CommentEditor key={comment.id} comment={comment} showResolve={index === 0} />
        ))}
        <ReplySection threadID={thread.id} />
      </Container>
    );
  }

  return (
    <Container draggable onDragStart={preventDefault()} onMouseDown={stopPropagation(null, true)} onClick={preventDefault()}>
      <NewComment origin={origin!} />
    </Container>
  );
};

export default ThreadEditor;
