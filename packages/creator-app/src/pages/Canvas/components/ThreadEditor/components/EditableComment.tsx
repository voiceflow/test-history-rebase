import { Callback } from '@voiceflow/common';
import { Box, KeyName } from '@voiceflow/ui';
import React from 'react';

import CommentPreview from '@/components/CommentPreview';
import MentionEditor from '@/components/MentionEditor';
import { useLinkedState } from '@/hooks';
import { Comment } from '@/models';
import { EngineContext } from '@/pages/Canvas/contexts';

import { COMMENT_CLASSNAME, COMMENT_EDITOR_CLASSNAME } from '../constants';
import ThreadEditorHeader, { ThreadEditorHeaderProps } from './ThreadEditorHeader';
import { PartialComment } from './types';

const EMPTY_COMMENT: PartialComment = { text: '', mentions: [] };

export interface EditableCommentRef {
  focus: VoidFunction;
}

export interface EditableCommentProps {
  onSave?: (value: PartialComment) => void;
  onChange?: (text: string, mentions: number[]) => void;
  isEditing?: boolean;
  onClose?: Callback;
  initialValues?: Pick<Comment, 'text' | 'mentions'>;
  headerProps?: Partial<ThreadEditorHeaderProps>;
  onBlur?: (values: Pick<Comment, 'text' | 'mentions'>) => void;
  hasHeader?: boolean;
  autoFocusInput?: boolean;
  placeholder: string;
}

const EditableComment: React.ForwardRefRenderFunction<EditableCommentRef, EditableCommentProps> = (
  {
    initialValues = EMPTY_COMMENT,
    isEditing,
    headerProps,
    onSave,
    onClose,
    onBlur: saveDraftValues,
    hasHeader = true,
    autoFocusInput = true,
    placeholder,
    onChange,
  },
  ref
) => {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const [comment, setComment] = useLinkedState<PartialComment>(initialValues);
  const engine = React.useContext(EngineContext)!;

  const onBlur = () => {
    if (comment.text) {
      saveDraftValues?.(comment);
    }
  };

  const handleOnChange = (text: string, mentions: number[]) => {
    setComment({ text, mentions });
    onChange?.(text, mentions);
  };

  const onPost = () => {
    onSave?.(comment);

    setComment(EMPTY_COMMENT);

    onClose?.();
  };

  React.useEffect(() => {
    // this is to render cursor at the end of the text
    if (inputRef.current) {
      const valueLength = inputRef.current.value.length;

      inputRef.current.setSelectionRange(valueLength, valueLength);
    }
  }, [isEditing]);

  const disableModes = () => engine.disableAllModes();

  React.useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }), []);

  return (
    <Box className={COMMENT_EDITOR_CLASSNAME} onBlur={onBlur}>
      {hasHeader && (
        <ThreadEditorHeader onPost={onPost} isEditing={isEditing} isDisabled={!headerProps?.threadID && !comment.text} {...headerProps} />
      )}
      <Box className={COMMENT_CLASSNAME} mt={12}>
        {isEditing ? (
          <MentionEditor
            onChange={handleOnChange}
            placeholder={placeholder}
            value={comment.text}
            inputProps={{
              inputRef,
              autoFocus: isEditing && autoFocusInput,
              onKeyDown: (e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === KeyName.ENTER) {
                  onPost();
                }
                if (e.key === KeyName.ESCAPE) {
                  disableModes();
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

export default React.forwardRef<EditableCommentRef, EditableCommentProps>(EditableComment);
