import React from 'react';

import TagSelect from '@/components/TagSelect';
import * as DiagramV2 from '@/ducks/diagramV2';
import { useSelector } from '@/hooks';

interface VariablesSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
}

// TODO: refactor variable states to use variable id instead of name
const VariablesSelect: React.FC<VariablesSelectProps> = ({ onChange, value, placeholder, disabled, error }) => {
  const variables = useSelector(DiagramV2.active.allEntitiesAndVariablesSelector);

  return (
    <TagSelect
      value={value}
      error={error}
      options={variables}
      onChange={onChange}
      disabled={disabled}
      isDropdown={false}
      placeholder={placeholder}
      getOptionKey={(option) => option.id}
      getOptionValue={(option) => option?.name}
      getOptionLabel={(value) => value}
      createInputPlaceholder="variables"
    />
  );
};

export default VariablesSelect;
