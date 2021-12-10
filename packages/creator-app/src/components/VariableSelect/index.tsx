import { Select, SelectProps, toast } from '@voiceflow/ui';
import React from 'react';

import * as DiagramV2 from '@/ducks/diagramV2';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import * as Version from '@/ducks/version';
import { useDispatch, useSelector } from '@/hooks';

export type VariableSelectProps = Omit<Partial<SelectProps<string, string>>, 'onSelect' | 'creatable' | 'onCreate'> & {
  onChange: (value: string) => void;
  creatable?: boolean;
};

const VariableSelect: React.FC<VariableSelectProps> = ({ value, onChange, ...props }) => {
  const variables = useSelector(DiagramV2.active.allSlotsAndVariablesSelector);
  const addVariable = useDispatch(Version.addGlobalVariable);

  const onCreate = async (item: string) => {
    if (!item) return;

    try {
      await addVariable(item, CanvasCreationType.EDITOR);
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
