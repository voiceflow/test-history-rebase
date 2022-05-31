import { Utils } from '@voiceflow/common';
import { BaseSelectProps, defaultMenuLabelRenderer, IconButton, NestedMenuComponents, Select, toast } from '@voiceflow/ui';
import React from 'react';

import * as DiagramV2 from '@/ducks/diagramV2';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import * as Version from '@/ducks/version';
import { useDispatch, useSelector } from '@/hooks';

export interface VariableSelectProps extends BaseSelectProps {
  value?: string | null;
  options?: string[];
  onChange: (value: string) => void;
  onCreate?: (value: string) => void;
  creatable?: boolean;
}

const VariableSelectV2: React.FC<VariableSelectProps> = ({ value, onChange, ...props }) => {
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
      creatable={false}
      searchable
      placeholder="Select or create variable"
      inDropdownSearch
      alwaysShowCreate
      getOptionLabel={(value) => `{${value}}`}
      renderOptionLabel={(option, searchLabel, _, getOptionValue, config) =>
        defaultMenuLabelRenderer<string, string>(option, searchLabel, (value) => value, getOptionValue, config)
      }
      renderSearchSuffix={({ searchLabel }) => (
        <IconButton size={16} icon="plus" variant={IconButton.Variant.BASIC} onClick={() => onCreate(searchLabel)} />
      )}
      clearOnSelectActive
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
