import React from 'react';

import { ClassName } from '@/styles/constants';

import BaseTagInput from './BaseReportTagInput';

interface SelectOnlyTagInputProps {
  onChange: (tags: string[]) => void;
  selectedTags: string[];
  hasRadioButtons: boolean;
  isSelectedFunc: (id: string) => boolean;
}

const SelectOnlyTagInput: React.FC<SelectOnlyTagInputProps> = ({ onChange, selectedTags, ...props }) => {
  const addTag = (tagID: string) => {
    onChange([...selectedTags, tagID]);
  };

  const removeTag = (tagID: string) => {
    const newTagArray = selectedTags.filter((id) => id !== tagID);
    onChange(newTagArray);
  };
  return (
    <BaseTagInput
      className={ClassName.BASE_REPORT_TAG_INPUT}
      onChange={onChange}
      addTag={addTag}
      selectedTags={selectedTags}
      removeTag={removeTag}
      selectOnly
      creatable={false}
      {...props}
    />
  );
};

export default SelectOnlyTagInput;
