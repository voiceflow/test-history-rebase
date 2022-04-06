import { Utils } from '@voiceflow/common';
import { NestedMenuComponents } from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import { addTag, currentTranscriptIDSelector, removeTag, updateTags } from '@/ducks/transcript';
import { useDispatch, useModals, useSelector } from '@/hooks';
import { ClassName } from '@/styles/constants';

import BaseTagInput from './BaseReportTagInput';

interface ManageTagInputProps {
  selectedTags: string[];
}

const ManageTagInput: React.FC<ManageTagInputProps> = ({ selectedTags }) => {
  const currentTranscriptID = useSelector(currentTranscriptIDSelector);

  const dispatchAddTag = useDispatch(addTag);
  const dispatchRemoveTag = useDispatch(removeTag);
  const dispatchUpdateTags = useDispatch(updateTags);

  const tagManagerModal = useModals(ModalType.TAG_MANAGER);

  const setTags = async (tags: string[]) => {
    if (!currentTranscriptID) return;

    await dispatchUpdateTags(currentTranscriptID, tags);
  };

  const addTagToTranscript = async (tagID: string) => {
    if (!currentTranscriptID) return;

    await dispatchAddTag(currentTranscriptID, tagID);
  };

  const removeTagFromTranscript = async (tagID: string) => {
    if (!currentTranscriptID) return;

    await dispatchRemoveTag(currentTranscriptID, tagID);
  };

  return (
    <BaseTagInput
      addTag={addTagToTranscript}
      onChange={setTags}
      removeTag={removeTagFromTranscript}
      className={ClassName.BASE_REPORT_TAG_INPUT}
      selectedTags={selectedTags}
      renderFooterAction={({ close }) => (
        <NestedMenuComponents.FooterActionContainer onClick={Utils.functional.chainVoid(close, tagManagerModal.open)}>
          Manage Tags
        </NestedMenuComponents.FooterActionContainer>
      )}
    />
  );
};

export default ManageTagInput;
