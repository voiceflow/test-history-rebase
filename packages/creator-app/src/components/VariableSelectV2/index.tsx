import { Utils } from '@voiceflow/common';
import { BaseSelectProps, defaultMenuLabelRenderer, IconButton, NestedMenuComponents, Select, toast } from '@voiceflow/ui';
import React from 'react';

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
      toast.error(err.message);
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
      renderEmpty={({ search }) => <Select.NotFound>{!search ? 'No variables exist in your assistant. ' : 'No variables found. '}</Select.NotFound>}
      renderSearchSuffix={({ close, searchLabel }) => (
        <IconButton
          size={16}
          icon="plus"
          variant={IconButton.Variant.BASIC}
          onClick={Utils.functional.chainVoid(close, () => onCreate(searchLabel))}
        />
      )}
      renderFooterAction={({ close, searchLabel }) => (
        <NestedMenuComponents.FooterActionContainer onClick={Utils.functional.chainVoid(close, () => onCreate(searchLabel))}>
          Create New Variable
        </NestedMenuComponents.FooterActionContainer>
      )}
      createInputPlaceholder="variables"
      {...props}
    />
  );
};

export default VariableSelectV2;
