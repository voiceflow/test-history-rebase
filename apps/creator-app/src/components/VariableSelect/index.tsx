import * as Realtime from '@voiceflow/realtime-sdk';
import { BaseSelectProps, Select, toast } from '@voiceflow/ui';
import React from 'react';

import * as DiagramV2 from '@/ducks/diagramV2';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import * as Version from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { useFeature } from '@/hooks/feature';
import { useVariableCreateModal } from '@/hooks/modal.hook';
import { getErrorMessage } from '@/utils/error';

export interface VariableSelectProps extends BaseSelectProps {
  value?: string | null;
  options?: string[];
  onChange: (value: string) => void;
  onCreate?: (value: string) => void;
  creatable?: boolean;
}

const VariableSelect: React.FC<VariableSelectProps> = ({ value, onChange, ...props }) => {
  const cmsVariables = useFeature(Realtime.FeatureFlag.CMS_VARIABLES);
  const variableCreateModal = useVariableCreateModal();
  const variables = useSelector(DiagramV2.active.allEntitiesAndVariablesSelector);
  const variablesMap = useSelector(DiagramV2.active.entitiesAndVariablesMapSelector);
  const addVariable = useDispatch(Version.addGlobalVariable);

  const onCreate = async (name: string) => {
    if (!name) return;

    if (cmsVariables.isEnabled) {
      try {
        const variable = await variableCreateModal.open({ name, folderID: null });

        onChange(variable.id);
      } catch {
        // do nothing
      }

      return;
    }

    try {
      await addVariable(name, CanvasCreationType.EDITOR);

      onChange(name);
    } catch (err) {
      toast.error(getErrorMessage(err));
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
      getOptionValue={(option) => (cmsVariables.isEnabled ? option?.id : option?.name)}
      getOptionLabel={(value) => (cmsVariables.isEnabled ? value && variablesMap[value]?.name : value)}
    />
  );
};

export default VariableSelect;
