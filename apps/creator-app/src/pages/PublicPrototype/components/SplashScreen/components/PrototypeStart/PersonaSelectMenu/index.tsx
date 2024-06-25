import type { Nullish } from '@voiceflow/common';
import React from 'react';

import * as Prototype from '@/ducks/prototype';
import { useDispatch, useToggle } from '@/hooks';
import { SettingsContext } from '@/pages/PublicPrototype/context';

import * as S from './styles';

interface VariableStateOption {
  label: string;
  value: string;
}

interface PersonaSelectMenuProps {
  render: (options: {
    ref: React.RefObject<HTMLElement>;
    isOpen: boolean;
    toggleSelectMenuOpen: () => void;
  }) => JSX.Element;
}

const PersonaSelectMenu: React.FC<PersonaSelectMenuProps> = ({ render }) => {
  const [isSelectMenuOpen, toggleSelectMenuOpen] = useToggle(false);
  const updatePrototypeSettings = useDispatch(Prototype.updatePrototype);
  const settings = React.useContext(SettingsContext);

  const variableStateOptions = React.useMemo(
    () => settings.variableStates.map<VariableStateOption>((state) => ({ label: state.name, value: state.id })),
    [settings.variableStates]
  );

  const variableStateOptionsMap = React.useMemo(
    () =>
      variableStateOptions.reduce<Record<string, VariableStateOption>>(
        (acc, option) => Object.assign(acc, { [option.value]: option }),
        {}
      ),
    [variableStateOptions]
  );

  const getOptionLabel = (variableStateID: Nullish<string>) =>
    variableStateID ? variableStateOptionsMap[variableStateID].label : '';

  const onSelect = (value: string) => {
    updatePrototypeSettings({
      selectedPersonaID: value,
    });
  };

  const isSearchable = variableStateOptions?.length >= 5;

  return (
    <S.SelectContainer
      options={variableStateOptions}
      onSelect={onSelect}
      open={isSelectMenuOpen}
      searchable={isSearchable}
      getOptionKey={(option) => option.value}
      getOptionValue={(option) => option?.value}
      getOptionLabel={getOptionLabel}
      alwaysShowCreate
      inDropdownSearch={isSearchable}
      isDropdown
      onClose={() => toggleSelectMenuOpen(false)}
      createInputPlaceholder="test persona"
      renderTrigger={({ ref, isOpen }) => render({ ref, isOpen, toggleSelectMenuOpen })}
    />
  );
};

export default PersonaSelectMenu;
