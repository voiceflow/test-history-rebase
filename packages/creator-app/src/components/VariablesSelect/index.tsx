import React from 'react';

import TagSelect from '@/components/TagSelect';
import * as DiagramV2 from '@/ducks/diagramV2';
import { useSelector } from '@/hooks';

interface VariablesSelectProps {
  onChange: (value: string[]) => void;
  value: string[];
  placeholder?: string;
  disabled?: boolean;
}

const VariablesSelect: React.FC<VariablesSelectProps> = ({ onChange, value, placeholder, disabled }) => {
  const variables = useSelector(DiagramV2.active.allSlotsAndVariablesSelector);

  return (
    <TagSelect
      getOptionLabel={(variable) => variable}
      getOptionValue={(variable) => variable}
      value={value}
      options={variables}
      onChange={onChange}
      createInputPlaceholder="variables"
      placeholder={placeholder}
      disabled={disabled}
      isDropdown={false}
    />
  );
};

export default VariablesSelect;
