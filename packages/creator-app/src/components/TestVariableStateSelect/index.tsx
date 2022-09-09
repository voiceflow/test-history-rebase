import { Utils } from '@voiceflow/common';
import {
  BaseSelectProps,
  isNotUIOnlyMenuItemOption,
  isUIOnlyMenuItemOption,
  Menu,
  OverflowText,
  OverflowTippyTooltip,
  SvgIcon,
  TippyTooltip,
} from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import * as variableState from '@/ducks/variableState';
import { useModals, useSelector, useVariableStatesPlanLimit } from '@/hooks';

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
  const verifyStatesLimit = useVariableStatesPlanLimit();

  const options = React.useMemo(() => {
    const statesOptions = variableStates.map((variableState) => ({ label: variableState.name, value: variableState.id }));

    if (statesOptions.length === 0) return baseOptions;

    return [...baseOptions, dividerOption, ...statesOptions];
  }, [variableStates]);

  const optionsMap = React.useMemo(() => Utils.array.createMap(options.filter(isNotUIOnlyMenuItemOption), Utils.object.selectValue), [options]);

  const selected = React.useMemo(() => options.find((option) => !isUIOnlyMenuItemOption(option) && option.value === value) || null, [options, value]);

  const onAddNew = verifyStatesLimit(openVariableStateEditorModal);

  return (
    <SelectContainer
      value={selected?.value}
      options={options}
      onSelect={onChange}
      searchable
      placeholder="Select a variable state"
      getOptionKey={(option) => option.value}
      getOptionValue={(option) => option?.value}
      getOptionLabel={(value) => value && optionsMap[value]?.label}
      renderOptionLabel={(option: VariableStateOption) => (
        <>
          <OverflowTippyTooltip title={option.label} overflow position="top-start">
            {(overflowref) => <OverflowText ref={overflowref}>{option.label}</OverflowText>}
          </OverflowTippyTooltip>

          {option.label !== 'All project variables' && (
            <Menu.ItemActionIcon icon="edit" onClick={() => openVariableStateManagerModal({ variableStateID: option.value })} />
          )}
        </>
      )}
      icon={loading ? 'arrowSpin' : undefined}
      iconProps={{ clickable: true, color: '#132144', spin: true, size: 16, marginRight: '-4px' }}
      disabled={loading}
      prefix={
        isSelectedStateUnsync &&
        !loading && (
          <TippyTooltip title="Update state values">
            <SvgIcon icon="arrowSpin" clickable color="#132144" onClick={onUpdateStateValues} size={16} />
          </TippyTooltip>
        )
      }
      renderFooterAction={({ close }) => (
        <Menu.Footer>
          <Menu.Footer.Action onClick={Utils.functional.chainVoid(close, onAddNew)}>Create New Persona</Menu.Footer.Action>
        </Menu.Footer>
      )}
      {...props}
    />
  );
};

export default TestVariableStateSelect;
