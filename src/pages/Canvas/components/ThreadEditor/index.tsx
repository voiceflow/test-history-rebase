import React from 'react';

import { Comment, Thread as ThreadType } from '@/models';

import { CommentEditor, Container, NewComment, ReplySection } from './components';

export type ThreadEditorProps = {
  thread?: ThreadType;
};

const ThreadEditor: React.FC<ThreadEditorProps> = ({ thread }) => {
  if (thread && !thread.resolved) {
    return (
      <Container>
        {thread.comments.map((comment: Comment, index: number) => (
          <CommentEditor key={comment.id} comment={comment} showResolve={index === 0} />
        ))}
        <ReplySection threadID={thread.id} />
      </Container>
    );
  }

  return (
    <Container>
      <NewComment />
    </Container>
  );
};

export default ThreadEditor;
