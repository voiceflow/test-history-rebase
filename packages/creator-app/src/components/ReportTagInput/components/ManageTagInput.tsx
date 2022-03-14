import React from 'react';

import { addTag, currentTranscriptIDSelector, removeTag, updateTags } from '@/ducks/transcript';
import { useDispatch, useSelector } from '@/hooks';

import BaseTagInput from './BaseReportTagInput';

interface ManageTagInputProps {
  className: string;
  selectedTags: string[];
  renderFooterAction?: (options: { close: VoidFunction }) => JSX.Element;
}

const ManageTagInput: React.FC<ManageTagInputProps> = ({ selectedTags, className, ...props }) => {
  const currentTranscriptID = useSelector(currentTranscriptIDSelector);
  const dispatchAddTag = useDispatch(addTag);
  const dispatchRemoveTag = useDispatch(removeTag);
  const dispatchUpdateTags = useDispatch(updateTags);

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
      {...props}
      className={className}
      addTag={addTagToTranscript}
      removeTag={removeTagFromTranscript}
      onChange={setTags}
      selectedTags={selectedTags}
    />
  );
};

export default ManageTagInput;
