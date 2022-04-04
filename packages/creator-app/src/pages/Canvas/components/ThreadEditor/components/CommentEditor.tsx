import React from 'react';

import { Comment } from '@/models';
import { EngineContext } from '@/pages/Canvas/contexts';

import Content from './Content';
import EditableComment from './EditableComment';

interface CommentEditorProps {
  comment: Comment;
  isEditing?: boolean;
  withResolve?: boolean;
  setEditingID: (commentID: string | null) => void;
  isThreadEditing?: boolean;
}

const CommentEditor: React.FC<CommentEditorProps> = ({ comment, isEditing, withResolve, setEditingID, isThreadEditing }) => {
  const engine = React.useContext(EngineContext)!;

  const onPost = async (text: string, mentions: number[]) => {
    if (text) {
      await engine.comment.updateComment(comment.threadID, comment.id, { text, mentions });
    } else {
      await engine.comment.deleteComment(comment.threadID, comment.id);
    }

    setEditingID(null);
  };

  return (
    <Content>
      <EditableComment
        onPost={onPost}
        onEdit={() => setEditingID(comment.id)}
        comment={comment}
        onDelete={() => engine.comment.deleteComment(comment.threadID, comment.id)}
        onCancel={() => setEditingID(null)}
        isEditing={isEditing}
        onResolve={withResolve ? () => engine.comment.resolveThread(comment.threadID) : undefined}
        placeholder="Comment or @mention"
        isThreadEditing={isThreadEditing}
      />
    </Content>
  );
};

export default CommentEditor;
