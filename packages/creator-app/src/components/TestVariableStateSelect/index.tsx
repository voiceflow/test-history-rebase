import {
  createUIOnlyMenuItemOption,
  FlexApart,
  isUIOnlyMenuItemOption,
  NestedMenuComponents,
  Select,
  SelectProps,
  SvgIcon,
  TippyTooltip,
} from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import * as variableState from '@/ducks/variableState';
import { useModals, useSelector } from '@/hooks';

export interface VariableStateOption {
  label: string;
  value: string;
}

type TestVariableStateSelectProps = Omit<Partial<SelectProps<VariableStateOption, string>>, 'onSelect' | 'creatable' | 'onCreate'> & {
  onChange: (value: string | null) => void;
  onUpdateStateValues: () => Promise<void>;
  loading: boolean;
};

const testVariableStateOptionRenderer = (option: VariableStateOption) => <FlexApart fullWidth>{option.label}</FlexApart>;

const baseOptions = [
  {
    label: 'All project variables',
    value: variableState.ALL_PROJECT_VARIABLES_ID,
  },
];

const dividerOption = createUIOnlyMenuItemOption('divider', { divider: true });

const TestVariableStateSelect: React.FC<TestVariableStateSelectProps> = ({ value, loading, onChange, onUpdateStateValues, className, ...props }) => {
  const variableStates = useSelector(variableState.allVariableStatesSelector);
  const isSelectedStateUnsync = useSelector(variableState.IsVariableStateUnsyncSelector);
  const { open: openVariableStateEditorModal } = useModals(ModalType.VARIABLE_STATE_EDITOR_MODAL);
  const { open: openVariableStateManagerModal } = useModals(ModalType.VARIABLE_STATES_MANAGER_MODAL);

  const options = React.useMemo(() => {
    const statesOptions = variableStates.map((variableState) => ({ label: variableState.name, value: variableState.id }));

    if (statesOptions.length === 0) {
      return baseOptions;
    }

    return [...baseOptions, dividerOption, ...statesOptions];
  }, [variableStates]);

  const selected = React.useMemo(() => options.find((option) => !isUIOnlyMenuItemOption(option) && option.value === value) || null, [options]);

  const onAddNew = () => {
    openVariableStateEditorModal();
  };

  return (
    <Select
      value={selected?.label || null}
      options={options}
      onSelect={(newValue) => onChange(newValue === value ? null : newValue)}
      searchable
      placeholder="Select a variable state"
      getOptionValue={(option) => option?.value}
      renderOptionLabel={testVariableStateOptionRenderer}
      icon={loading ? 'publishSpin' : undefined}
      iconProps={{ clickable: true, color: '#606468', spin: true }}
      disabled={loading}
      prefix={
        isSelectedStateUnsync &&
        !loading && (
          <TippyTooltip title="Update state values">
            <SvgIcon icon="publishSpin" clickable color="#606468" onClick={onUpdateStateValues} size={20} />
          </TippyTooltip>
        )
      }
      footerAction={(hideMenu) => (
        <NestedMenuComponents.FooterActions>
          {options.length > baseOptions.length && (
            <NestedMenuComponents.FooterAction
              onClick={() => {
                hideMenu();
                openVariableStateManagerModal();
              }}
            >
              Manage
            </NestedMenuComponents.FooterAction>
          )}

          <NestedMenuComponents.FooterAction
            onClick={() => {
              hideMenu();
              onAddNew();
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
