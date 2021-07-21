import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { currentSelectedTranscriptSelector, updateTags } from '@/ducks/transcript';

import BaseTagInput from './BaseReportTagInput';

interface ManageTagInputProps {
  selectedTags: string[];
  footerAction: boolean;
  footerActionLabel: string;
  onClickFooterAction: () => void;
}

const ManageTagInput: React.FC<ManageTagInputProps> = ({ selectedTags, ...props }) => {
  const currentTranscript = useSelector(currentSelectedTranscriptSelector);
  const dispatch = useDispatch();
  const setTags = (tags: string[]) => {
    dispatch(updateTags(currentTranscript.id, tags));
  };

  return <BaseTagInput {...props} onChange={setTags} selectedTags={selectedTags} />;
};

export default ManageTagInput;
