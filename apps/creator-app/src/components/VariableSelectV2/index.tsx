import { Utils } from '@voiceflow/common';
import type { BaseSelectProps } from '@voiceflow/ui';
import { defaultMenuLabelRenderer, Menu, Select, System } from '@voiceflow/ui';
import React from 'react';

import { Diagram } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

export interface VariableSelectProps extends BaseSelectProps {
  value?: string | null;
  onChange: (value: string) => void;
  onCreate: (value: string) => Promise<string>;
  creatable?: boolean;
}

const VariableSelectV2: React.FC<VariableSelectProps> = ({ value, onChange, onCreate: onCreateProp, ...props }) => {
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
          (value) => value && variablesMap[value]?.name,
          getOptionValue,
          config
        )
      }
      clearOnSelectActive
      renderEmpty={({ search }) => (
        <Menu.NotFound>{!search ? 'No variables exist in your assistant. ' : 'No variables found. '}</Menu.NotFound>
      )}
      renderSearchSuffix={({ close, searchLabel }) => (
        <System.IconButtonsGroup.Base>
          <System.IconButton.Base
            icon="plus"
            onClick={Utils.functional.chainVoid(close, () => onCreate(searchLabel))}
          />
        </System.IconButtonsGroup.Base>
      )}
      renderFooterAction={({ close, searchLabel }) => (
        <Menu.Footer>
          <Menu.Footer.Action onClick={Utils.functional.chainVoid(close, () => onCreate(searchLabel))}>
            Create New Variable
          </Menu.Footer.Action>
        </Menu.Footer>
      )}
      createInputPlaceholder="variables"
      {...props}
      getOptionKey={(option) => option.id}
      getOptionValue={(option) => option?.id}
      getOptionLabel={(value) => value && variablesMap[value] && `{${variablesMap[value].name}}`}
    />
  );
};

export default VariableSelectV2;
