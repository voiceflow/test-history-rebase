import { Nullish } from '@voiceflow/common';
import { NestedMenuComponents } from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import * as VariableState from '@/ducks/variableState';
import { useDispatch, useModals, useSelector, useToggle } from '@/hooks';

import { SelectContainer } from './components';

interface VariableStateOption {
  label: string;
  value: string;
}

interface VariableStateSelectMenuProps {
  render: (options: { ref: React.RefObject<HTMLInputElement>; isOpen: boolean; toggleSelectMenuOpen: () => void }) => JSX.Element;
}

const VariableStateSelectMenu: React.FC<VariableStateSelectMenuProps> = ({ render }) => {
  const { open: openEditorModal } = useModals(ModalType.VARIABLE_STATE_EDITOR_MODAL);
  const [isSelectMenuOpen, toggleSelectMenuOpen] = useToggle(false);
  const variableStates = useSelector(VariableState.allVariableStatesSelector);
  const updateSelectedVariableStateById = useDispatch(VariableState.updateSelectedVariableStateById);

  const variableStateOptions = React.useMemo(
    () => variableStates.map<VariableStateOption>((state) => ({ label: state.name, value: state.id })),
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
      getOptionValue={(option) => option?.value}
      getOptionLabel={getOptionLabel}
      inDropdownSearch
      alwaysShowCreate
      isDropdown
      onClose={() => toggleSelectMenuOpen(false)}
      createInputPlaceholder="states"
      triggerRenderer={({ ref, isOpen }) => render({ ref, isOpen, toggleSelectMenuOpen })}
      footerAction={() => (
        <NestedMenuComponents.FooterActions>
          <NestedMenuComponents.FooterAction onClick={openEditorModal}>Add New State</NestedMenuComponents.FooterAction>
        </NestedMenuComponents.FooterActions>
      )}
    />
  );
};

export default VariableStateSelectMenu;
