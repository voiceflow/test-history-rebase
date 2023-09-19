import { BaseSelectProps, Select } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';

import * as DiagramV2 from '@/ducks/diagramV2';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import * as Version from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { getErrorMessage } from '@/utils/error';

export interface VariableSelectProps extends BaseSelectProps {
  value?: string | null;
  options?: string[];
  onChange: (value: string) => void;
  onCreate?: (value: string) => void;
  creatable?: boolean;
}

const VariableSelect: React.FC<VariableSelectProps> = ({ value, onChange, ...props }) => {
  const variables = useSelector(DiagramV2.active.allSlotNamesAndVariablesSelector);
  const addVariable = useDispatch(Version.addGlobalVariable);

  const onCreate = async (item: string) => {
    if (!item) return;

    try {
      await addVariable(item, CanvasCreationType.EDITOR);
      onChange(item);
    } catch (err) {
      toast.error(getErrorMessage(err));
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
