import { ErrorMessage, IconButton, IconButtonVariant, Input, toast, ToastCallToAction } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import * as ReportTagDuck from '@/ducks/reportTag';
import { useDispatch } from '@/hooks';
import { ReportTag } from '@/models';
import { FadeLeftContainer } from '@/styles/animations';
import { ClassName } from '@/styles/constants';

import { Container, TrashIconContainer } from './styles';

interface TagLineItemProps {
  tag: ReportTag;
  // This should come from redux later
  tags: ReportTag[];
  onDelete: (id: string) => void;
  onUndoDelete: (tag: ReportTag) => void;
}

const TagLineItem: React.FC<TagLineItemProps> = ({ tags, onUndoDelete, onDelete, tag }) => {
  const updateTag = useDispatch(ReportTagDuck.updateTag);

  const [tagVal, setTagVal] = React.useState(tag.label);
  const [tagError, setTagError] = React.useState('');

  const otherTags = React.useMemo(() => tags.filter(({ id }) => id !== tag.id), [tags]);

  const onDeleteTag = () => {
    onDelete(tag.id);

    toast.success(
      <>
        Successfully deleted '{tag.label}' <br />
        <ToastCallToAction onClick={() => onUndoDelete(tag)}>Undo</ToastCallToAction>
      </>
    );
  };

  const onTagChange = (value: string) => {
    setTagVal(value);

    const lowercaseValue = value.toLowerCase();

    if (otherTags.some((tag) => tag.label.toLowerCase() === lowercaseValue)) {
      setTagError('Tag name already exists');
    } else if (!value) {
      setTagError('Tag name is required');
    } else {
      setTagError('');
    }
  };

  const saveUpdate = () => {
    if (!tagError) {
      updateTag(tag.id, tagVal);
    }
  };

  return (
    <Container>
      <Input
        error={!!tagError}
        value={tagVal}
        onBlur={saveUpdate}
        className={cn(`${ClassName.TAG_MODAL_INPUT_FIELD}-${tag.label}`)}
        onChangeText={onTagChange}
      />

      {tagError && (
        <FadeLeftContainer>
          <ErrorMessage style={{ marginBottom: '0', paddingTop: '8px' }}>{tagError}</ErrorMessage>
        </FadeLeftContainer>
      )}

      <TrashIconContainer>
        <IconButton
          icon="garbage"
          size={16}
          onClick={onDeleteTag}
          variant={IconButtonVariant.SQUARE}
          className={cn(`${ClassName.DELETE_TAG_BUTTON}-${tag.label}`)}
        />
      </TrashIconContainer>
    </Container>
  );
};

export default TagLineItem;
