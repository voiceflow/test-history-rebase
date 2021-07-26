import React from 'react';

import { addTag, currentSelectedTranscriptSelector, removeTag, updateTags } from '@/ducks/transcript';
import { useDispatch, useSelector } from '@/hooks';

import BaseTagInput from './BaseReportTagInput';

interface ManageTagInputProps {
  selectedTags: string[];
  footerAction: boolean;
  footerActionLabel: string;
  onClickFooterAction: () => void;
}

const ManageTagInput: React.FC<ManageTagInputProps> = ({ selectedTags, ...props }) => {
  const currentTranscript = useSelector(currentSelectedTranscriptSelector);
  const dispatchAddTag = useDispatch(addTag);
  const dispatchRemoveTag = useDispatch(removeTag);
  const dispatchUpdateTags = useDispatch(updateTags);

  const setTags = async (tags: string[]) => {
    await dispatchUpdateTags(currentTranscript.id, tags);
  };

  const addTagToTranscript = async (tagID: string) => {
    await dispatchAddTag(currentTranscript.id, tagID);
  };

  const removeTagFromTranscript = async (tagID: string) => {
    await dispatchRemoveTag(currentTranscript.id, tagID);
  };

  return <BaseTagInput {...props} addTag={addTagToTranscript} removeTag={removeTagFromTranscript} onChange={setTags} selectedTags={selectedTags} />;
};

export default ManageTagInput;
