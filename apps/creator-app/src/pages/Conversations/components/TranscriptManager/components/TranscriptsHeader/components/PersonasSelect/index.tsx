import { Menu } from '@voiceflow/ui';
import React from 'react';

import TagSelect from '@/components/TagSelect';
import * as VariableState from '@/ducks/variableState';
import { useSelector } from '@/hooks';

interface PersonasSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  error?: boolean;
}

const PersonasSelect: React.FC<PersonasSelectProps> = ({ onChange, value, disabled, error }) => {
  const personas = useSelector(VariableState.allVariableStatesSelector);
  const options = React.useMemo(() => personas?.map((persona) => persona.id), [personas]);

  const personasMap = React.useMemo(() => Object.fromEntries(personas?.map((persona) => [persona.id, persona])), [personas]);
  const isSearchable = options?.length >= 5;

  return (
    <TagSelect
      value={value}
      options={options}
      getOptionValue={(id) => id}
      getOptionLabel={(id) => id && personasMap[id]?.name}
      onChange={onChange}
      disabled={disabled}
      isDropdown={false}
      inDropdownSearch={isSearchable}
      placeholder="Test Persona"
      createInputPlaceholder="personas"
      renderEmpty={() => <Menu.NotFound>No personas found</Menu.NotFound>}
      error={error}
    />
  );
};

export default PersonasSelect;
