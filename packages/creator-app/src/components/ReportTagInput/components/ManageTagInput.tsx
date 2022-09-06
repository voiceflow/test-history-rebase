import { Utils } from '@voiceflow/common';
import { Menu } from '@voiceflow/ui';
import React from 'react';

import { addTag, currentTranscriptIDSelector, removeTag, updateTags } from '@/ducks/transcript';
import { useDispatch, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
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

  const tagManagerModal = ModalsV2.useModal(ModalsV2.Conversation.TagManager);

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
        <Menu.Footer>
          <Menu.Footer.Action onClick={Utils.functional.chainVoid(close, () => tagManagerModal.openVoid())}>Manage Tags</Menu.Footer.Action>
        </Menu.Footer>
      )}
    />
  );
};

export default ManageTagInput;
