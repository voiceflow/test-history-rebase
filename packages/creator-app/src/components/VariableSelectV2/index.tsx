import { Utils } from '@voiceflow/common';
import { BaseSelectProps, defaultMenuLabelRenderer, IconButton, NestedMenuComponents, Select, toast } from '@voiceflow/ui';
import React from 'react';

export interface VariableSelectProps extends BaseSelectProps {
  value?: string | null;
  options: string[];
  creatable?: boolean;
  onChange: (value: string) => void;
  onCreate: (value: string) => void | Promise<void>;
}

const VariableSelectV2: React.FC<VariableSelectProps> = ({ value, options, onChange, onCreate, ...props }) => {
  const handleCreation = async (value: string) => {
    try {
      await onCreate(value);
      onChange(value);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Select
      value={value}
      options={options}
      onSelect={onChange}
      onCreate={handleCreation}
      creatable={false}
      searchable
      placeholder="Select or create variable"
      inDropdownSearch
      alwaysShowCreate
      getOptionLabel={(value) => value && `{${value}}`}
      renderOptionLabel={(option, searchLabel, _, getOptionValue, config) =>
        defaultMenuLabelRenderer<string, string>(option, searchLabel, (value) => value, getOptionValue, config)
      }
      renderSearchSuffix={({ searchLabel }) => (
        <IconButton size={16} icon="plus" variant={IconButton.Variant.BASIC} onClick={() => handleCreation(searchLabel)} />
      )}
      clearOnSelectActive
      renderFooterAction={({ close, searchLabel }) => (
        <NestedMenuComponents.FooterActionContainer onClick={Utils.functional.chainVoid(close, () => handleCreation(searchLabel))}>
          Create New Variable
        </NestedMenuComponents.FooterActionContainer>
      )}
      createInputPlaceholder="variables"
      {...props}
    />
  );
};

export default VariableSelectV2;
