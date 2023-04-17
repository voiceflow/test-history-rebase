import { Utils } from '@voiceflow/common';
import { BaseSelectProps, defaultMenuLabelRenderer, Menu, Select, System, toast } from '@voiceflow/ui';
import React from 'react';

import { getErrorMessage } from '@/utils/error';

export interface VariableSelectProps extends BaseSelectProps {
  value?: string | null;
  options: string[];
  creatable?: boolean;
  onChange: (value: string) => void;
  onCreate: (value: string) => Promise<string>;
}

const VariableSelectV2: React.FC<VariableSelectProps> = ({ value, options, onChange, onCreate: onCreateProp, ...props }) => {
  const onCreate = async (value: string) => {
    try {
      const newVariable = await onCreateProp(value);

      onChange(newVariable);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Select
      value={value}
      options={options}
      onSelect={onChange}
      onCreate={onCreate}
      creatable={false}
      searchable
      placeholder="Select or create variable"
      getOptionLabel={(value) => value && `{${value}}`}
      inDropdownSearch
      alwaysShowCreate
      renderOptionLabel={(option, searchLabel, _, getOptionValue, config) =>
        defaultMenuLabelRenderer<string, string>(option, searchLabel, (value) => value, getOptionValue, config)
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
    />
  );
};

export default VariableSelectV2;
