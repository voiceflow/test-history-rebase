import { Select, SelectProps, toast } from '@voiceflow/ui';
import React from 'react';

import * as Diagram from '@/ducks/diagram';
import * as Version from '@/ducks/version';
import { useDispatch, useSelector } from '@/hooks';

export type VariableSelectProps = Omit<Partial<SelectProps<string, string>>, 'onSelect' | 'creatable' | 'onCreate'> & {
  onChange: (value: string) => void;
  creatable?: boolean;
};

const VariableSelect: React.FC<VariableSelectProps> = ({ value, onChange, ...props }) => {
  const variables = useSelector(Diagram.activeDiagramAllVariablesSelector);
  const addVariable = useDispatch(Version.addGlobalVariable);

  const onCreate = (item: string) => {
    if (!item) return;

    try {
      addVariable(item);
      onChange(item);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Select
      value={value}
      options={variables}
      onSelect={onChange}
      onCreate={onCreate}
      creatable
      searchable
      placeholder="Select Variable"
      createInputPlaceholder="Variable"
      {...props}
    />
  );
};

export default VariableSelect;
