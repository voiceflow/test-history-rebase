import { Utils } from '@voiceflow/common';
import React from 'react';

import { ClassName } from '@/styles/constants';

import BaseTagInput from './BaseReportTagInput';

interface SelectOnlyTagInputProps {
  onChange: (tags: string[]) => void;
  selectedTags: string[];
}

const SelectOnlyTagInput: React.FC<SelectOnlyTagInputProps> = ({ onChange, selectedTags }) => (
  <BaseTagInput
    addTag={(tagID) => onChange(Utils.array.unique([...selectedTags, tagID]))}
    onChange={onChange}
    className={ClassName.BASE_REPORT_TAG_INPUT}
    removeTag={(tagID) => onChange(selectedTags.filter((id) => id !== tagID))}
    creatable={false}
    selectOnly
    selectedTags={selectedTags}
    hasRadioButtons
    isSelectedFunc={(id) => selectedTags.includes(id)}
  />
);

export default SelectOnlyTagInput;
