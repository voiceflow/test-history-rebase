import React from 'react';

import Box from '@/components/Box';
import MentionEditor from '@/components/MentionEditor';
import { Permission } from '@/config/permissions';
import { Comment, Thread as ThreadType } from '@/models';
import { CommentModeContext } from '@/pages/Skill/contexts/CommentingContext';

import { CommentEditor, Container, Header, ReplySection } from './components';

export type ThreadEditorProps = {
  thread: ThreadType;
};

const ThreadEditor: React.FC<ThreadEditorProps> = ({ thread }) => {
  const commenting = React.useContext(CommentModeContext);

  const onBlur = () => {
    if (!commenting.text) {
      commenting.resetValues();
    }
  };

  if (thread) {
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
      <Box>
        <Header onPost={commenting.postThread} isDisabled={!commenting.text} />
        <Box mt={12}>
          <MentionEditor
            permissiongType={Permission.COMMENTING}
            onChange={commenting.setValues}
            value={commenting.text}
            placeholder="Comment or @mention"
            onBlur={onBlur}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default ThreadEditor;
