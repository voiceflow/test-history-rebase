import React from 'react';

import BaseTagInput from './BaseReportTagInput';

interface SelectOnlyTagInputProps {
  onChange: (tags: string[]) => void;
  selectedTags: string[];
  hasRadioButtons: boolean;
  isSelectedFunc: (id: string) => boolean;
}

const SelectOnlyTagInput: React.FC<SelectOnlyTagInputProps> = (props) => {
  return <BaseTagInput selectOnly creatable={false} {...props} />;
};

export default SelectOnlyTagInput;
