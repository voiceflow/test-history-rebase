import intersectionWith from 'lodash/intersectionWith';
import isEqual from 'lodash/isEqual';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import Badge from '@/components/Badge';
import Box from '@/components/Box';
import Button, { ButtonVariant } from '@/components/Button';
import ErrorMessage from '@/components/ErrorPages/ErrorMessage';
import Input from '@/components/Input';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import { allReportTagsSelector, createTag, deleteTag } from '@/ducks/reportTag';
import { useModals } from '@/hooks';
import { ReportTag, Sentiment, SentimentArray, SystemTag, SystemTagArray } from '@/models';
import { FadeLeftContainer } from '@/styles/animations';
import { withKeyPress } from '@/utils/dom';

import { Content, NewTagInputContainer, TagLineItem } from './components';

const tagInputToArray = (val: string) => {
  return [
    ...new Set(
      val
        .split(',')
        .map((val) => val.trim().toLowerCase())
        .filter(Boolean)
    ),
  ];
};

const TagManagerModal: React.FC<RouteComponentProps> = () => {
  const allTags = useSelector(allReportTagsSelector);
  const dispatch = useDispatch();

  const editableTags = allTags.filter((tag: ReportTag) => {
    return !SystemTagArray.includes(tag.id as SystemTag) && !SentimentArray.includes(tag.id as Sentiment);
  });
  const [modalRef, setModalRef] = React.useState<HTMLDivElement | null>(null);
  const { close: closeTagManager } = useModals(ModalType.TAG_MANAGER);

  const tagsLabelArray = React.useMemo(() => editableTags.map(({ label }) => label), [editableTags]);
  const [addVal, setAddVal] = React.useState('');
  const [addError, setAddError] = React.useState('');

  const onDeleteTag = (id: string) => {
    dispatch(deleteTag(id));
  };

  const onUndoDelete = (tag: ReportTag) => {
    dispatch(createTag(tag.label, tag.id));
  };

  const onAdd = () => {
    const newTags = tagInputToArray(addVal);

    newTags.forEach((tagLabel) => {
      dispatch(createTag(tagLabel));
    });

    setAddVal('');
  };

  const onAddInputChange = ({ target: { value: val } }: React.ChangeEvent<HTMLInputElement>) => {
    setAddVal(val);
    const newTags = tagInputToArray(val);
    const alreadyExistingTags = intersectionWith(tagsLabelArray, newTags, isEqual);

    if (alreadyExistingTags.length) {
      setAddError('Tag name already exists');
    } else {
      setAddError('');
    }
  };

  return (
    <Modal id={ModalType.TAG_MANAGER} ref={setModalRef} title="Manage Tags" isSmall>
      {!!modalRef && (
        <Box width="100%">
          <ModalBody style={{ padding: '0' }}>
            <NewTagInputContainer>
              <Input
                onKeyPress={withKeyPress(13, onAdd)}
                error={!!addError}
                value={addVal}
                onChange={onAddInputChange}
                placeholder="Add new tags separated by commas"
                hasAction
                rightAction={
                  addVal && (
                    <Badge slide onClick={onAdd}>
                      Enter
                    </Badge>
                  )
                }
              />
              {addError && (
                <FadeLeftContainer>
                  <ErrorMessage style={{ marginBottom: '0px', paddingTop: '8px' }}>{addError}</ErrorMessage>
                </FadeLeftContainer>
              )}
            </NewTagInputContainer>
            <Content>
              {editableTags.map((tag) => {
                return <TagLineItem key={tag.id} onUndoDelete={onUndoDelete} onDelete={onDeleteTag} tags={allTags} tag={tag} />;
              })}
            </Content>
          </ModalBody>
          <ModalFooter justifyContent="flex-end">
            <Button variant={ButtonVariant.TERTIARY} onClick={closeTagManager}>
              Close
            </Button>
          </ModalFooter>
        </Box>
      )}
    </Modal>
  );
};

export default TagManagerModal as React.FC;
