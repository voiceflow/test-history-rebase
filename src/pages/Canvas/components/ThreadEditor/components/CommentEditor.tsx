import React from 'react';

import Box from '@/components/Box';
import CommentPreview from '@/components/CommentPreview';
import MentionEditor from '@/components/MentionEditor';
import { Permission } from '@/config/permissions';
import { useEnableDisable } from '@/hooks';
import { Comment } from '@/models';
import { CommentModeContext } from '@/pages/Skill/contexts/CommentingContext';

import ThreadEditorHeader from './ThreadEditorHeader';

type CommentEditorProps = {
  showResolve: boolean;
  comment: Comment;
};

const CommentEditor: React.FC<CommentEditorProps> = ({ comment, showResolve }) => {
  const [isEditing, enableEditing, disableEditing] = useEnableDisable(false);

  const commenting = React.useContext(CommentModeContext);

  const doneEditing = async () => {
    await commenting.updateComment();

    disableEditing();
    commenting.setThreadID(null);
    commenting.setCommentID(null);
  };

  const onEdit = () => {
    commenting.setValues(comment.text, comment.mentions);

    enableEditing();
    commenting.setThreadID(comment.threadID);
    commenting.setCommentID(comment.id);
  };

  const onBlur = () => {
    if (!commenting.text) {
      commenting.resetValues();
      disableEditing();
    }
  };

  return (
    <Box>
      <ThreadEditorHeader
        creatorID={comment.creatorID}
        commentID={comment.id}
        threadID={comment.threadID}
        onPost={doneEditing}
        onEdit={onEdit}
        isEditing={isEditing}
        showResolve={showResolve}
        isPosted={!isEditing}
      />
      <Box mt={12} onBlur={onBlur}>
        {isEditing ? (
          <MentionEditor
            permissiongType={Permission.COMMENTING}
            onChange={commenting.setValues}
            placeholder="Comment or @mention"
            value={commenting.text}
            onBlur={onBlur}
          />
        ) : (
          <CommentPreview text={comment?.text} />
        )}
      </Box>
    </Box>
  );
};

export default CommentEditor;
