import { Utils } from '@voiceflow/common';
import { Badge, Box, Button, ButtonVariant, ErrorMessage, Input } from '@voiceflow/ui';
import intersectionWith from 'lodash/intersectionWith';
import isEqual from 'lodash/isEqual';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import { allReportTagsSelector, createTag, deleteTag } from '@/ducks/reportTag';
import { useDispatch, useModals, useSelector, useTrackingEvents } from '@/hooks';
import { ReportTag } from '@/models';
import { FadeLeftContainer } from '@/styles/animations';
import { isBuiltInTag } from '@/utils/reportTag';

import { Content, NewTagInputContainer, TagLineItem } from './components';

const tagInputToArray = (val: string) =>
  Utils.array.unique(
    val
      .split(',')
      .map((val) => val.trim().toLowerCase())
      .filter(Boolean)
  );

const TagManagerModal: React.FC<RouteComponentProps> = () => {
  const [trackingEvents] = useTrackingEvents();

  const allTags = useSelector(allReportTagsSelector);
  const deleteReportTag = useDispatch(deleteTag);
  const createReportTag = useDispatch(createTag);

  const tagManagerModal = useModals(ModalType.TAG_MANAGER);

  const [addVal, setAddVal] = React.useState('');
  const [addError, setAddError] = React.useState('');

  const editableTags = React.useMemo(() => allTags.filter((tag: ReportTag) => !isBuiltInTag(tag.id)), [allTags]);
  const tagsLabelArray = React.useMemo(() => editableTags.map(({ label }) => label), [editableTags]);

  const onDeleteTag = (id: string) => {
    deleteReportTag(id);
    trackingEvents.trackConversationTagDeleted();
  };

  const onUndoDelete = (tag: ReportTag) => {
    createReportTag(tag.label, tag.id);
  };

  const onAdd = () => {
    const newTags = tagInputToArray(addVal);

    newTags.forEach((tagLabel) => createReportTag(tagLabel));

    setAddVal('');
  };

  const onAddInputChange = (value: string) => {
    setAddVal(value);

    const newTags = tagInputToArray(value);
    const alreadyExistingTags = intersectionWith(tagsLabelArray, newTags, isEqual);

    if (alreadyExistingTags.length) {
      setAddError('Tag name already exists');
    } else {
      setAddError('');
    }
  };

  return (
    <Modal id={ModalType.TAG_MANAGER} title="Manage Tags">
      <Box width="100%">
        <ModalBody style={{ padding: '0' }}>
          <NewTagInputContainer>
            <Input
              error={!!addError}
              value={addVal}
              nested
              onChangeText={onAddInputChange}
              onEnterPress={onAdd}
              placeholder="Add new tags separated by commas"
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
            {editableTags.map((tag) => (
              <TagLineItem key={tag.id} onUndoDelete={onUndoDelete} onDelete={onDeleteTag} tags={allTags} tag={tag} />
            ))}
          </Content>
        </ModalBody>

        <ModalFooter justifyContent="flex-end">
          <Button variant={ButtonVariant.TERTIARY} onClick={tagManagerModal.close}>
            Close
          </Button>
        </ModalFooter>
      </Box>
    </Modal>
  );
};

export default TagManagerModal as React.FC;
