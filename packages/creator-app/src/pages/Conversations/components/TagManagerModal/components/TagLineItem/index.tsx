import React from 'react';

import ErrorMessage from '@/components/ErrorPages/ErrorMessage';
import IconButton, { IconButtonVariant } from '@/components/IconButton';
import Input from '@/components/Input';
import { toast, ToastCallToAction } from '@/components/Toast';
import { ReportTag } from '@/models';
import { FadeLeftContainer } from '@/styles/animations';

import { Container, TrashIconContainer } from './components';

interface TagLineItemProps {
  tag: ReportTag;
  // This should come from redux later
  tags: ReportTag[];
  onDelete: (id: string) => void;
  onUndoDelete: (tag: ReportTag) => void;
}

const TagLineItem: React.FC<TagLineItemProps> = ({ tags, onUndoDelete, onDelete, tag }) => {
  const [tagVal, setTagVal] = React.useState(tag.label);
  const [tagError, setTagError] = React.useState('');
  const allOtherTags = React.useMemo(() => tags.filter(({ id }) => id !== tag.id), [tags]);

  const onDeleteTag = () => {
    onDelete(tag.id);
    toast.success(
      <>
        Successfully deleted '{tag.label}' <br />
        <ToastCallToAction onClick={() => onUndoDelete(tag)}>Undo</ToastCallToAction>
      </>
    );
  };

  const onTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTagVal(val);

    if (allOtherTags.some((tag) => tag.label.toLowerCase() === val.toLowerCase())) {
      setTagError('Tag name already exists');
    } else if (!val) {
      setTagError('Tag name is required');
    } else {
      setTagError('');
    }
  };

  return (
    <Container>
      <Input error={!!tagError} value={tagVal} onChange={onTagChange} />
      {tagError && (
        <FadeLeftContainer>
          <ErrorMessage style={{ marginBottom: '0px', paddingTop: '8px' }}>{tagError}</ErrorMessage>
        </FadeLeftContainer>
      )}
      <TrashIconContainer>
        <IconButton icon="garbage" size={16} onClick={onDeleteTag} variant={IconButtonVariant.SQUARE} />
      </TrashIconContainer>
    </Container>
  );
};

export default TagLineItem;
