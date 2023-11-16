import { Nullable } from '@voiceflow/common';
import { ThreadComment } from '@voiceflow/dtos';
import { Comment as LegacyComment } from '@voiceflow/realtime-sdk';
import { Box, KeyName, useCache } from '@voiceflow/ui';
import React from 'react';

import CommentPreview from '@/components/CommentPreview';
import MentionEditor from '@/components/MentionEditor';
import { useLinkedState, useToggle } from '@/hooks';
import { CommentDraftValue } from '@/pages/Canvas/types';

import { COMMENT_CLASSNAME, COMMENT_EDITOR_CLASSNAME } from '../constants';
import ThreadEditorHeader from './ThreadEditorHeader';

export interface EditableCommentProps {
  onPost: (value: string, mentions: number[]) => Promise<void>;
  onEdit?: VoidFunction;
  comment?: Nullable<ThreadComment | LegacyComment>;
  onCancel?: VoidFunction;
  onDelete?: VoidFunction;
  isEditing?: boolean;
  onResolve?: VoidFunction;
  placeholder: string;
  withResolve?: boolean;
  initialValue?: string;
  initialMentions?: number[];
  isThreadEditing?: boolean;
}

export interface EditableCommentRef {
  getDraft: () => CommentDraftValue | null;
  setDraft: (draft: CommentDraftValue) => void;
}

const INITIAL_MENTIONS: number[] = [];

const EditableComment: React.ForwardRefRenderFunction<EditableCommentRef, EditableCommentProps> = (
  {
    onPost: onPostProp,
    onEdit,
    comment,
    onCancel,
    onDelete,
    isEditing,
    onResolve,
    placeholder,
    initialValue = '',
    initialMentions = INITIAL_MENTIONS,
    isThreadEditing,
  },
  ref
) => {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const [value, setValue] = useLinkedState(comment?.text ?? initialValue);
  const [mentions, setMentions] = useLinkedState(comment?.mentions ?? initialMentions);
  const [posting, togglePosting] = useToggle();

  const onChange = (text: string, mentions: number[]) => {
    setValue(text);
    setMentions(mentions);
  };

  const onPost = async () => {
    try {
      togglePosting(true);

      await onPostProp(value, mentions);
    } finally {
      togglePosting(false);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === KeyName.ENTER && (event.metaKey || event.ctrlKey)) {
      onPost();
    } else if (event.key === KeyName.ESCAPE) {
      onCancel?.();
    }
  };

  React.useEffect(() => {
    // this is to render cursor at the end of the text
    if (isEditing && inputRef.current) {
      const valueLength = inputRef.current.value.length;

      inputRef.current.focus({ preventScroll: true });
      inputRef.current.setSelectionRange(valueLength, valueLength);
    }
  }, [isEditing]);

  const cache = useCache({ text: value, mentions });
  React.useImperativeHandle(
    ref,
    () => ({
      getDraft: () => cache.current,
      setDraft: (draft) => {
        setValue(draft.text);
        setMentions(draft.mentions);
      },
    }),
    [cache]
  );

  return (
    <Box className={COMMENT_EDITOR_CLASSNAME}>
      <ThreadEditorHeader
        onEdit={onEdit}
        onPost={onPost}
        comment={comment}
        onDelete={onDelete}
        isPosting={posting}
        isEditing={isEditing}
        onResolve={onResolve}
        isDisabled={!comment && !value}
        isThreadEditing={isThreadEditing}
      />

      <Box className={COMMENT_CLASSNAME} mt={12}>
        {isEditing ? (
          <MentionEditor value={value} onChange={onChange} placeholder={placeholder} inputProps={{ inputRef, onKeyDown }} />
        ) : (
          <CommentPreview text={comment?.text} />
        )}
      </Box>
    </Box>
  );
};

export default React.forwardRef(EditableComment);
