import { FlexApart, NestedMenuComponents, Select, SelectProps } from '@voiceflow/ui';
import React from 'react';

// import * as VersionV2 from '@/ducks/versionV2';
// import { useSelector } from '@/hooks';

export interface VariableStateOption {
  label: string;
  value: string;
}

type TestVariableStateSelectProps = Omit<Partial<SelectProps<VariableStateOption, string>>, 'onSelect' | 'creatable' | 'onCreate'> & {
  onChange: (value: string) => void;
};

const testVariableStateOptionRenderer = (option: VariableStateOption) => <FlexApart fullWidth>{option.label}</FlexApart>;

export const ALL_PROJECT_VARIABLES = 'all_project_variables';

const baseOptions = [
  {
    label: 'All project variables',
    value: ALL_PROJECT_VARIABLES,
  },
  {
    label: 'Divider 1',
    value: 'divider',
    menuItemProps: { divider: true },
  },
];

const TestVariableStateSelect: React.FC<TestVariableStateSelectProps> = ({ value, onChange, className, ...props }) => {
  // const variablesStates = useSelector(VersionV2.active.variablesStatesSelector);
  const selected = baseOptions.find((variableState) => variableState.value === value) || null;

  return (
    <Select
      value={selected?.label || null}
      options={baseOptions}
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
