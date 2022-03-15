import { Utils } from '@voiceflow/common';
import {
  BaseSelectProps,
  FlexApart,
  isNotUIOnlyMenuItemOption,
  isUIOnlyMenuItemOption,
  NestedMenuComponents,
  SvgIcon,
  TippyTooltip,
} from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import * as variableState from '@/ducks/variableState';
import { useModals, useSelector } from '@/hooks';

import { SelectContainer } from './components';
import { baseOptions, dividerOption } from './constants';
import { VariableStateOption } from './types';

interface TestVariableStateSelectProps extends BaseSelectProps {
  value?: string | null;
  loading: boolean;
  onChange: (value: string | null) => void;
  onUpdateStateValues: () => Promise<void>;
}

const TestVariableStateSelect: React.FC<TestVariableStateSelectProps> = ({ value, loading, onChange, onUpdateStateValues, className, ...props }) => {
  const variableStates = useSelector(variableState.allVariableStatesSelector);
  const isSelectedStateUnsync = useSelector(variableState.IsVariableStateUnsyncSelector);
  const { open: openVariableStateEditorModal } = useModals(ModalType.VARIABLE_STATE_EDITOR_MODAL);
  const { open: openVariableStateManagerModal } = useModals(ModalType.VARIABLE_STATES_MANAGER_MODAL);

  const options = React.useMemo(() => {
    const statesOptions = variableStates.map((variableState) => ({ label: variableState.name, value: variableState.id }));

    if (statesOptions.length === 0) return baseOptions;

    return [...baseOptions, dividerOption, ...statesOptions];
  }, [variableStates]);

  const optionsMap = React.useMemo(() => Utils.array.createMap(options.filter(isNotUIOnlyMenuItemOption), Utils.object.selectValue), [options]);

  const selected = React.useMemo(() => options.find((option) => !isUIOnlyMenuItemOption(option) && option.value === value) || null, [options, value]);

  const onAddNew = () => {
    openVariableStateEditorModal();
  };

  return (
    <SelectContainer
      value={selected?.value}
      options={options}
      onSelect={(newValue) => onChange(newValue === value ? null : newValue)}
      searchable
      placeholder="Select a variable state"
      getOptionKey={(option) => option.value}
      getOptionValue={(option) => option?.value}
      getOptionLabel={(value) => value && optionsMap[value]?.label}
      renderOptionLabel={(option: VariableStateOption) => <FlexApart fullWidth>{option.label}</FlexApart>}
      icon={loading ? 'publishSpin' : undefined}
      iconProps={{ clickable: true, color: '#132144', spin: true, size: 21.3, marginRight: '-4px' }}
      disabled={loading}
      prefix={
        isSelectedStateUnsync &&
        !loading && (
          <TippyTooltip title="Update state values">
            <SvgIcon icon="publishSpin" clickable color="#132144" onClick={onUpdateStateValues} size={21.3} marginRight="-4px" />
          </TippyTooltip>
        )
      }
      renderFooterAction={({ close }) => (
        <NestedMenuComponents.FooterActions>
          {options.length > baseOptions.length && (
            <NestedMenuComponents.FooterAction onClick={Utils.functional.chainVoid(close, openVariableStateManagerModal)}>
              Manage
            </NestedMenuComponents.FooterAction>
          )}

          <NestedMenuComponents.FooterAction onClick={Utils.functional.chainVoid(close, onAddNew)}>Add New</NestedMenuComponents.FooterAction>
        </NestedMenuComponents.FooterActions>
      )}
      {...props}
    />
  );
};

export default TestVariableStateSelect;
