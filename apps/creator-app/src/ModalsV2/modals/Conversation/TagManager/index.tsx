import { Utils } from '@voiceflow/common';
import { Animations, Badge, Box, Button, ButtonVariant, ErrorMessage, Input, Modal } from '@voiceflow/ui';
import intersectionWith from 'lodash/intersectionWith';
import isEqual from 'lodash/isEqual';
import React from 'react';

import { allReportTagsSelector, createTag, deleteTag } from '@/ducks/reportTag';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import type { ReportTag } from '@/models';
import { isBuiltInTag } from '@/utils/reportTag';

import manager from '../../../manager';
import { Content, NewTagInputContainer, TagLineItem } from './components';

const tagInputToArray = (val: string) =>
  Utils.array.unique(
    val
      .split(',')
      .map((val) => val.trim().toLowerCase())
      .filter(Boolean)
  );

const TagManager = manager.create('TagManager', () => ({ api, type, opened, hidden, animated }) => {
  const [trackingEvents] = useTrackingEvents();

  const allTags = useSelector(allReportTagsSelector);
  const deleteReportTag = useDispatch(deleteTag);
  const createReportTag = useDispatch(createTag);

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
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header>Manage Tags</Modal.Header>
      <Box width="100%">
        <Modal.Body style={{ padding: '0' }}>
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
              <Animations.FadeLeft>
                <ErrorMessage style={{ marginBottom: '0', paddingTop: '8px' }}>{addError}</ErrorMessage>
              </Animations.FadeLeft>
            )}
          </NewTagInputContainer>
          <Content>
            {editableTags.map((tag) => (
              <TagLineItem key={tag.id} onUndoDelete={onUndoDelete} onDelete={onDeleteTag} tags={allTags} tag={tag} />
            ))}
          </Content>
        </Modal.Body>

        <Modal.Footer justifyContent="flex-end">
          <Button variant={ButtonVariant.TERTIARY} onClick={api.onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Box>
    </Modal>
  );
});

export default TagManager;
