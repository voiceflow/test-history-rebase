import React from 'react';

import { useEnableDisable } from '@/hooks';
import { Comment } from '@/models';
import { EngineContext } from '@/pages/Canvas/contexts';

import EditableComment from './EditableComment';

type CommentEditorProps = {
  showResolve: boolean;
  comment: Comment;
};

const CommentEditor: React.FC<CommentEditorProps> = ({ comment, showResolve }) => {
  const engine = React.useContext(EngineContext)!;
  const [isEditing, startEditing, stopEditing] = useEnableDisable();

  return (
    <EditableComment
      isEditing={isEditing}
      initialValues={comment}
      onSave={(values) => engine.comment.updateComment(comment.threadID, comment.id, values)}
      onClose={stopEditing}
      headerProps={{
        creatorID: comment.creatorID,
        commentID: comment.id,
        threadID: comment.threadID,
        showResolve,
        postedTime: comment.created,
        isEditing,
        onEdit: startEditing,
        isPosted: !isEditing,
      }}
    />
  );
};

export default CommentEditor;
