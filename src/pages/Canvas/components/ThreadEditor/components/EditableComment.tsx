import React from 'react';

import Box from '@/components/Box';
import CommentPreview from '@/components/CommentPreview';
import MentionEditor from '@/components/MentionEditor';
import { useLinkedState } from '@/hooks';
import { Comment } from '@/models';
import { Callback } from '@/types';

import ThreadEditorHeader, { ThreadEditorHeaderProps } from './ThreadEditorHeader';

type PartialComment = Pick<Comment, 'text' | 'mentions'>;

const EMPTY_COMMENT: PartialComment = { text: '', mentions: [] };

export type EditableCommentProps = {
  onSave: (value: PartialComment) => void;
  isEditing?: boolean;
  onClose?: Callback;
  initialValues?: Comment;
  headerProps?: Partial<ThreadEditorHeaderProps>;
};

const EditableComment: React.RefForwardingComponent<{ reset: () => void }, EditableCommentProps> = (
  { initialValues = EMPTY_COMMENT, isEditing, headerProps, onSave, onClose },
  ref
) => {
  const [comment, setComment] = useLinkedState<PartialComment>(initialValues);

  const onBlur = () => {
    if (!comment.text) {
      setComment(EMPTY_COMMENT);
      onClose?.();
    }
  };

  React.useImperativeHandle(ref, () => ({
    reset: () => setComment(EMPTY_COMMENT),
  }));

  return (
    <Box>
      <ThreadEditorHeader
        onPost={() => {
          onSave(comment);
          setComment(EMPTY_COMMENT);
          onClose?.();
        }}
        isEditing={isEditing}
        isDisabled={!headerProps?.threadID && !comment.text}
        {...headerProps}
      />
      <Box mt={12}>
        {isEditing ? (
          <MentionEditor
            onChange={(text, mentions) => setComment({ text, mentions })}
            placeholder="Comment or @mention"
            value={comment.text}
            onBlur={onBlur}
          />
        ) : (
          <CommentPreview text={comment.text} />
        )}
      </Box>
    </Box>
  );
};

export default React.forwardRef(EditableComment);
