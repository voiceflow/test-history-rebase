import { Badge, Box, Button, ButtonVariant, ErrorMessage, Input, KeyName } from '@voiceflow/ui';
import intersectionWith from 'lodash/intersectionWith';
import isEqual from 'lodash/isEqual';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import { allReportTagsSelector, createTag, deleteTag } from '@/ducks/reportTag';
import { useDispatch, useModals, useSelector } from '@/hooks';
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
  const deleteReportTag = useDispatch(deleteTag);
  const createReportTag = useDispatch(createTag);

  const editableTags = allTags.filter((tag: ReportTag) => {
    return !SystemTagArray.includes(tag.id as SystemTag) && !SentimentArray.includes(tag.id as Sentiment);
  });
  const [modalRef, setModalRef] = React.useState<HTMLDivElement | null>(null);
  const { close: closeTagManager } = useModals(ModalType.TAG_MANAGER);

  const tagsLabelArray = React.useMemo(() => editableTags.map(({ label }) => label), [editableTags]);
  const [addVal, setAddVal] = React.useState('');
  const [addError, setAddError] = React.useState('');

  const onDeleteTag = (id: string) => {
    deleteReportTag(id);
  };

  const onUndoDelete = (tag: ReportTag) => {
    createReportTag(tag.label, tag.id);
  };

  const onAdd = () => {
    const newTags = tagInputToArray(addVal);

    newTags.forEach((tagLabel) => {
      createReportTag(tagLabel);
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
                onKeyPress={withKeyPress(KeyName.ENTER, onAdd)}
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
                  <ErrorMessage style={{ marginBottom: '0', paddingTop: '8px' }}>{addError}</ErrorMessage>
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
