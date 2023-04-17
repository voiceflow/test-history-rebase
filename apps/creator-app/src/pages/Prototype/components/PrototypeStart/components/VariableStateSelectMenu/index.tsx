import { Nullish } from '@voiceflow/common';
import { Menu, OverflowText, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import * as VariableState from '@/ducks/variableState';
import { useCreateVariableState, useDispatch, useSelector, useToggle } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import { OverflowWrapper, SelectContainer } from './components';

interface VariableStateOption {
  label: string;
  value: string;
}

interface VariableStateSelectMenuProps {
  render: (options: { ref: React.RefObject<HTMLElement>; isOpen: boolean; toggleSelectMenuOpen: () => void }) => JSX.Element;
}

const VariableStateSelectMenu: React.FC<VariableStateSelectMenuProps> = ({ render }) => {
  const variableStates = useSelector(VariableState.allVariableStatesSelector);
  const updateSelectedVariableStateById = useDispatch(VariableState.updateSelectedVariableStateById);

  const [isSelectMenuOpen, toggleSelectMenuOpen] = useToggle(false);

  const variableStateManageModal = ModalsV2.useModal(ModalsV2.VariableStates.Manage);

  const onCreateVariableState = useCreateVariableState();

  const variableStateOptions = React.useMemo(
    () =>
      variableStates.length
        ? variableStates.map<VariableStateOption>((state) => ({ label: state.name, value: state.id }))
        : [{ label: 'All assistant variables', value: VariableState.ALL_PROJECT_VARIABLES_ID }],
    [variableStates]
  );

  const variableStateOptionsMap = React.useMemo(
    () => variableStateOptions.reduce<Record<string, VariableStateOption>>((acc, option) => Object.assign(acc, { [option.value]: option }), {}),
    [variableStateOptions]
  );

  const getOptionLabel = (variableStateID: Nullish<string>) => (variableStateID ? variableStateOptionsMap[variableStateID].label : '');

  return (
    <SelectContainer
      options={variableStateOptions}
      onSelect={updateSelectedVariableStateById}
      open={isSelectMenuOpen}
      searchable
      getOptionKey={(option) => option.value}
      getOptionValue={(option) => option?.value}
      getOptionLabel={getOptionLabel}
      inDropdownSearch
      alwaysShowCreate
      isDropdown
      onClose={() => toggleSelectMenuOpen(false)}
      createInputPlaceholder="personas"
      renderTrigger={({ ref, isOpen }) => render({ ref, isOpen, toggleSelectMenuOpen })}
      renderFooterAction={() => (
        <Menu.Footer>
          <Menu.Footer.Action onClick={onCreateVariableState}>Create New Persona</Menu.Footer.Action>
        </Menu.Footer>
      )}
      renderOptionLabel={(option: VariableStateOption) => (
        <OverflowWrapper>
          <OverflowText style={{ display: 'block', overflow: 'hidden' }}>{option.label}</OverflowText>
          <SvgIcon
            icon="edit"
            variant={SvgIcon.Variant.STANDARD}
            onClick={() => variableStateManageModal.openVoid({ variableStateID: option.value })}
          />
        </OverflowWrapper>
      )}
    />
  );
};

export default VariableStateSelectMenu;
