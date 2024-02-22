import { BaseSelectProps, Select } from '@voiceflow/ui';
import React from 'react';

import * as DiagramV2 from '@/ducks/diagramV2';
import { useSelector } from '@/hooks';
import { useVariableCreateModal } from '@/hooks/modal.hook';

export interface VariableSelectProps extends BaseSelectProps {
  value?: string | null;
  options?: string[];
  onChange: (value: string) => void;
  onCreate?: (value: string) => void;
  creatable?: boolean;
}

const VariableSelect: React.FC<VariableSelectProps> = ({ value, onChange, ...props }) => {
  const variableCreateModal = useVariableCreateModal();
  const variables = useSelector(DiagramV2.active.allEntitiesAndVariablesSelector);
  const variablesMap = useSelector(DiagramV2.active.entitiesAndVariablesMapSelector);

  const onCreate = async (name: string) => {
    try {
      const variable = await variableCreateModal.open({ name, folderID: null });

      onChange(variable.id);
    } catch {
      // do nothing
    }
  };

  return (
    <Select
      creatable
      searchable
      placeholder="Select Variable"
      createInputPlaceholder="Variable"
      {...props}
      value={value}
      options={variables}
      onSelect={onChange}
      onCreate={onCreate}
      getOptionKey={(option) => option.id}
      getOptionValue={(option) => option?.id}
      getOptionLabel={(value) => value && variablesMap[value]?.name}
    />
  );
};

export default VariableSelect;
