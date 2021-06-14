import cuid from 'cuid';
import intersectionWith from 'lodash/intersectionWith';
import isEqual from 'lodash/isEqual';
import uniqBy from 'lodash/uniqBy';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Badge from '@/components/Badge';
import Box from '@/components/Box';
import Button, { ButtonVariant } from '@/components/Button';
import ErrorMessage from '@/components/ErrorPages/ErrorMessage';
import Input from '@/components/Input';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';
import { ReportTag } from '@/models';
import { FadeLeftContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';
import { withKeyPress } from '@/utils/dom';

import { Content, NewTagInputContainer, TagLineItem } from './components';

const DUMMY_DATA = [
  { id: '1', projectID: '1', label: 'user error' },
  { id: '2', projectID: '2', label: 'happy path' },
];

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

const TagManagerModal: React.FC<RouteComponentProps & TagManagerModalConnectedProps> = ({ projectID }) => {
  const [modalRef, setModalRef] = React.useState<HTMLDivElement | null>(null);
  const { close: closeTagManager } = useModals(ModalType.TAG_MANAGER);
  const [allTags, setAllTags] = React.useState(DUMMY_DATA);

  const tagsLabelArray = React.useMemo(() => allTags.map(({ label }) => label), [allTags]);
  const [addVal, setAddVal] = React.useState('');
  const [addError, setAddError] = React.useState('');

  const onDeleteTag = (id: string) => {
    const newAllTags = allTags.filter((tag) => tag.id !== id);
    setAllTags(newAllTags);
  };

  const onUndoDelete = (tag: ReportTag) => {
    setAllTags(uniqBy([tag, ...allTags], ({ id }) => id));
  };

  const onAdd = () => {
    const newTags = tagInputToArray(addVal);

    if (!addError && newTags.length) {
      setAddVal('');
      const tagObjects = newTags.map((tagLabel) => ({ id: cuid(), label: tagLabel, projectID: projectID! }));
      setAllTags([...allTags, ...tagObjects]);
    }
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
              {allTags.map((tag) => {
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

const mapStateToProps = {
  projectID: Session.activeProjectIDSelector,
};

const mapDispatchToProps = {
  goInteractionModel: Router.goToCurrentCanvasInteractionModel,
};

export type TagManagerModalConnectedProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(TagManagerModal) as React.FC;
