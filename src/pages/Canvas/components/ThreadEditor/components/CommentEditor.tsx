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

  const { editingComment, setEditingValues, resetEditingValues, updateComment } = React.useContext(CommentModeContext);

  const doneEditing = async () => {
    await updateComment();

    disableEditing();
  };

  const onEdit = () => {
    setEditingValues(comment);
    enableEditing();
  };

  const onBlur = () => {
    if (!editingComment?.text) {
      resetEditingValues();
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
        postedTime={comment.created}
      />
      <Box mt={12} onBlur={onBlur}>
        {isEditing ? (
          <MentionEditor
            permissiongType={Permission.COMMENTING}
            onChange={(text: string, mentions: number[]) => setEditingValues({ ...editingComment, text, mentions } as Comment)}
            placeholder="Comment or @mention"
            value={editingComment?.text}
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
