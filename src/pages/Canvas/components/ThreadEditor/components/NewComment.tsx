import React from 'react';

import Box from '@/components/Box';
import MentionEditor from '@/components/MentionEditor';
import { Permission } from '@/config/permissions';
import { CommentModeContext } from '@/pages/Skill/contexts/CommentingContext';

import Header from './ThreadEditorHeader';

export type NewCommentProps = {};

const NewComment: React.FC<NewCommentProps> = () => {
  const { newComment, setNewValues, resetNewValues, postThread } = React.useContext(CommentModeContext);

  const onBlur = () => {
    if (!newComment?.text) {
      resetNewValues();
    }
  };

  return (
    <Box>
      <Header onPost={postThread} isDisabled={!newComment?.text} />
      <Box mt={12}>
        <MentionEditor
          permissiongType={Permission.COMMENTING}
          onChange={(text: string, mentions: number[]) => setNewValues({ text, mentions })}
          value={!newComment?.threadID ? newComment?.text : ''}
          placeholder="Comment or @mention"
          onBlur={onBlur}
        />
      </Box>
    </Box>
  );
};

export default NewComment;
