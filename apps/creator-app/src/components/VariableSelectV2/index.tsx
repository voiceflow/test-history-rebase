import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { BaseSelectProps, defaultMenuLabelRenderer, Menu, Select, System } from '@voiceflow/ui';
import React from 'react';

import { Diagram } from '@/ducks';
import { useFeature } from '@/hooks/feature';
import { useSelector } from '@/hooks/store.hook';

export interface VariableSelectProps extends BaseSelectProps {
  value?: string | null;
  onChange: (value: string) => void;
  onCreate: (value: string) => Promise<string>;
  creatable?: boolean;
}

const VariableSelectV2: React.FC<VariableSelectProps> = ({ value, onChange, onCreate: onCreateProp, ...props }) => {
  const cmsVariables = useFeature(Realtime.FeatureFlag.CMS_VARIABLES);

  const variables = useSelector(Diagram.active.allEntitiesAndVariablesSelector);
  const variablesMap = useSelector(Diagram.active.entitiesAndVariablesMapSelector);

  const onCreate = async (value: string) => {
    const newVariable = await onCreateProp(value);

    onChange(newVariable);
  };

  return (
    <Select
      value={value}
      options={variables}
      onSelect={onChange}
      onCreate={onCreate}
      creatable={false}
      searchable
      placeholder="Select or create variable"
      inDropdownSearch
      alwaysShowCreate
      renderOptionLabel={(option, searchLabel, _, getOptionValue, config) =>
        defaultMenuLabelRenderer(
          option,
          searchLabel,
          (value) => (cmsVariables.isEnabled ? value && variablesMap[value]?.name : value),
          getOptionValue,
          config
        )
      }
      clearOnSelectActive
      renderEmpty={({ search }) => <Menu.NotFound>{!search ? 'No variables exist in your assistant. ' : 'No variables found. '}</Menu.NotFound>}
      renderSearchSuffix={({ close, searchLabel }) => (
        <System.IconButtonsGroup.Base>
          <System.IconButton.Base icon="plus" onClick={Utils.functional.chainVoid(close, () => onCreate(searchLabel))} />
        </System.IconButtonsGroup.Base>
      )}
      renderFooterAction={({ close, searchLabel }) => (
        <Menu.Footer>
          <Menu.Footer.Action onClick={Utils.functional.chainVoid(close, () => onCreate(searchLabel))}>Create New Variable</Menu.Footer.Action>
        </Menu.Footer>
      )}
      createInputPlaceholder="variables"
      {...props}
      getOptionKey={(option) => option.id}
      getOptionValue={(option) => (cmsVariables.isEnabled ? option?.id : option?.name)}
      getOptionLabel={(value) => (cmsVariables.isEnabled ? value && variablesMap[value] && `{${variablesMap[value].name}}` : value && `{${value}}`)}
    />
  );
};

export default VariableSelectV2;
