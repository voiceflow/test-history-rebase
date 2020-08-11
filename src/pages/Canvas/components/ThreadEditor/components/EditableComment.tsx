import React from 'react';

import Box from '@/components/Box';
import CommentPreview from '@/components/CommentPreview';
import MentionEditor from '@/components/MentionEditor';
import { useLinkedState } from '@/hooks';
import { Comment } from '@/models';
import { EngineContext } from '@/pages/Canvas/contexts';
import { Callback } from '@/types';

import ThreadEditorHeader, { ThreadEditorHeaderProps } from './ThreadEditorHeader';
import { PartialComment } from './types';

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
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const [comment, setComment] = useLinkedState<PartialComment>(initialValues);
  const engine = React.useContext(EngineContext)!;

  const onBlur = () => {
    if (!comment.text) {
      setComment(EMPTY_COMMENT);
      onClose?.();
    }
  };

  React.useImperativeHandle(ref, () => ({
    reset: () => setComment(EMPTY_COMMENT),
  }));

  React.useEffect(() => {
    // TODO: figure out why this is needed
    // this is to render cursor at the end of the text

    if (inputRef.current) {
      const valueLength = inputRef.current.value.length;

      inputRef.current.setSelectionRange(valueLength, valueLength);
    }
  }, [isEditing]);

  const onPost = () => {
    onSave(comment);
    setComment(EMPTY_COMMENT);
    onClose?.();
    inputRef?.current?.blur();
  };

  return (
    <Box>
      <ThreadEditorHeader onPost={onPost} isEditing={isEditing} isDisabled={!headerProps?.threadID && !comment.text} {...headerProps} />
      <Box mt={12}>
        {isEditing ? (
          <MentionEditor
            onChange={(text, mentions) => setComment({ text, mentions })}
            placeholder="Comment or @mention"
            value={comment.text}
            onBlur={onBlur}
            inputProps={{
              inputRef,
              autoFocus: isEditing,
              onKeyDown: async (e) => {
                if ((e.metaKey || e.ctrlKey) && e.keyCode === 13) {
                  onPost();
                }
                if (e.keyCode === 27) {
                  await engine.disableAllModes();
                }
              },
            }}
          />
        ) : (
          <CommentPreview text={comment.text} />
        )}
      </Box>
    </Box>
  );
};

export default React.forwardRef(EditableComment);
