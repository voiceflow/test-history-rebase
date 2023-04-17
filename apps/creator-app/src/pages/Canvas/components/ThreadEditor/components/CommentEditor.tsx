import { Comment } from '@voiceflow/realtime-sdk';
import React from 'react';

import { useSetup } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';

import Content from './Content';
import EditableComment from './EditableComment';

interface CommentEditorProps {
  comment: Comment;
  isActive?: boolean;
  isEditing?: boolean;
  withResolve?: boolean;
  setEditingID: (commentID: string | null) => void;
  isThreadEditing?: boolean;
  autoscrollIntoView?: boolean;
}

const CommentEditor: React.FC<CommentEditorProps> = ({ comment, isActive, isEditing, withResolve, setEditingID, isThreadEditing }) => {
  const engine = React.useContext(EngineContext)!;
  const contentRef = React.useRef<HTMLDivElement>(null);

  const onPost = async (text: string, mentions: number[]) => {
    if (text) {
      await engine.comment.updateComment(comment.threadID, comment.id, { text, mentions });
    } else {
      await engine.comment.deleteComment(comment.threadID, comment.id);
    }

    setEditingID(null);
  };

  useSetup(() => {
    if (!isActive) return;

    contentRef.current?.scrollIntoView({ block: 'center' });
  });

  return (
    <Content ref={contentRef} onClick={() => !isThreadEditing && engine.comment.setFocusComment(isActive ? null : comment.id)}>
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
