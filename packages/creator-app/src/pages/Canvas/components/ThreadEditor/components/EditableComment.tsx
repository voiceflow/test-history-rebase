import { Box, KeyName } from '@voiceflow/ui';
import React from 'react';

import CommentPreview from '@/components/CommentPreview';
import MentionEditor from '@/components/MentionEditor';
import { useLinkedState } from '@/hooks';
import { Comment } from '@/models';
import { EngineContext } from '@/pages/Canvas/contexts';
import { Callback } from '@/types';

import { COMMENT_CLASSNAME, COMMENT_EDITOR_CLASSNAME } from '../constants';
import ThreadEditorHeader, { ThreadEditorHeaderProps } from './ThreadEditorHeader';
import { PartialComment } from './types';

const EMPTY_COMMENT: PartialComment = { text: '', mentions: [] };

export type EditableCommentProps = {
  onSave: (value: PartialComment) => void;
  isEditing?: boolean;
  onClose?: Callback;
  initialValues?: Pick<Comment, 'text' | 'mentions'>;
  headerProps?: Partial<ThreadEditorHeaderProps>;
  onBlur?: (values: Pick<Comment, 'text' | 'mentions'>) => void;
  hasHeader?: boolean;
  placeholder: string;
  height?: number;
};

const EditableComment: React.FC<EditableCommentProps> = ({
  initialValues = EMPTY_COMMENT,
  isEditing,
  headerProps,
  onSave,
  onClose,
  onBlur: saveDraftValues,
  hasHeader = true,
  placeholder,
  height,
}) => {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const [comment, setComment] = useLinkedState<PartialComment>(initialValues);
  const engine = React.useContext(EngineContext)!;

  const onBlur = () => {
    if (comment.text) {
      saveDraftValues?.(comment);
    }
  };

  const onPost = () => {
    onSave(comment);

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

  return (
    <Box className={COMMENT_EDITOR_CLASSNAME} onBlur={onBlur}>
      {hasHeader && (
        <ThreadEditorHeader onPost={onPost} isEditing={isEditing} isDisabled={!headerProps?.threadID && !comment.text} {...headerProps} />
      )}
      <Box className={COMMENT_CLASSNAME} mt={12}>
        {isEditing ? (
          <MentionEditor
            height={height}
            onChange={(text, mentions) => setComment({ text, mentions })}
            placeholder={placeholder}
            value={comment.text}
            inputProps={{
              inputRef,
              autoFocus: isEditing,
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

export default EditableComment;
