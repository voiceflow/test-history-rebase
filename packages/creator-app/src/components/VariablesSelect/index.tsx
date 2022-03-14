import React from 'react';

import TagSelect from '@/components/TagSelect';
import * as DiagramV2 from '@/ducks/diagramV2';
import { useSelector } from '@/hooks';

interface VariablesSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

const VariablesSelect: React.FC<VariablesSelectProps> = ({ onChange, value, placeholder, disabled }) => {
  const variables = useSelector(DiagramV2.active.allSlotsAndVariablesSelector);

  return (
    <TagSelect
      value={value}
      options={variables}
      onChange={onChange}
      disabled={disabled}
      isDropdown={false}
      placeholder={placeholder}
      createInputPlaceholder="variables"
    />
  );
};

export default VariablesSelect;
