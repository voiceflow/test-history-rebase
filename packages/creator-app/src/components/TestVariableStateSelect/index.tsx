import { FlexApart, NestedMenuComponents, Select, SelectProps } from '@voiceflow/ui';
import React from 'react';

import * as variableState from '@/ducks/variableState';
import { useSelector } from '@/hooks';

export interface VariableStateOption {
  label: string;
  value: string;
}

type TestVariableStateSelectProps = Omit<Partial<SelectProps<VariableStateOption, string>>, 'onSelect' | 'creatable' | 'onCreate'> & {
  onChange: (value: string) => void;
};

const testVariableStateOptionRenderer = (option: VariableStateOption) => <FlexApart fullWidth>{option.label}</FlexApart>;

const dividerOption = {
  label: 'Divider 1',
  value: 'divider',
  menuItemProps: { divider: true },
};

const baseOptions = [
  {
    label: 'All project variables',
    value: variableState.ALL_PROJECT_VARIABLES_ID,
  },
  dividerOption,
];

const TestVariableStateSelect: React.FC<TestVariableStateSelectProps> = ({ value, onChange, className, ...props }) => {
  const variableStates = useSelector(variableState.allVariableStatesSelector);

  const variableStatesOptions = React.useMemo(() => {
    const statesOptions = variableStates.map((variableState) => ({ label: variableState.name, value: variableState.id }));
    return [...baseOptions, ...statesOptions];
  }, [variableStates]);

  const selected = variableStatesOptions.find((variableState) => variableState.value === value) || null;

  return (
    <Select
      value={selected?.label || null}
      options={variableStatesOptions}
      onSelect={(newValue) => onChange(newValue === value ? '' : newValue)}
      searchable
      placeholder="Select a variable state"
      getOptionValue={(option) => option?.value}
      renderOptionLabel={testVariableStateOptionRenderer}
      footerAction={(hideMenu) => (
        <NestedMenuComponents.FooterActions>
          <NestedMenuComponents.FooterAction
            onClick={() => {
              hideMenu();
            }}
          >
            Manage
          </NestedMenuComponents.FooterAction>
          <NestedMenuComponents.FooterAction
            onClick={() => {
              hideMenu();
            }}
          >
            Add New
          </NestedMenuComponents.FooterAction>
        </NestedMenuComponents.FooterActions>
      )}
      {...props}
    />
  );
};

export default TestVariableStateSelect;
