import type { Nullish } from '@voiceflow/common';
import type { GetOptionLabel, GetOptionValue } from '@voiceflow/ui';
import {
  Box,
  createDividerMenuItemOption,
  getNestedMenuFormattedLabel,
  Menu,
  OverflowText,
  Select,
  SvgIcon,
  System,
  Text,
} from '@voiceflow/ui';
import React from 'react';

import { ALL_PERSONA_ID } from '@/constants';
import { PERSONAS_LEARN_MORE } from '@/constants/link.constant';
import * as Prototype from '@/ducks/prototype';
import * as VariableState from '@/ducks/variableState';
import { useCreateVariableState, useDispatch, useSelector } from '@/hooks';
import { useModal } from '@/hooks/modal.hook';
import ManageVariableStatesModal from '@/ModalsV2/modals/VariableStates/Manage';

import * as S from './styles';

const ALL = { id: ALL_PERSONA_ID, name: 'All personas' } as const;

type PersonaOption = Nullish<{ label: string; value: string }>;

interface PersonasSelectProps {
  preventClose: VoidFunction;
  enableClose: VoidFunction;
}

const PersonasSelect: React.FC<PersonasSelectProps> = ({ preventClose, enableClose }) => {
  const variableStates = useSelector(VariableState.allVariableStatesSelector);
  const updatePrototype = useDispatch(Prototype.updatePrototype);
  const selectedPersonaID = useSelector(Prototype.prototypeSelectedPersonaID);
  const onCreateVariableState = useCreateVariableState();
  const personas = React.useMemo(() => [ALL, ...variableStates], [variableStates]);
  const variableStateManageModal = useModal(ManageVariableStatesModal);

  const options = React.useMemo(() => {
    if (!variableStates?.length) return [];

    return [
      { value: ALL.id, label: ALL.name },
      createDividerMenuItemOption('divider'),
      ...(variableStates?.map((variableState) => ({ label: variableState.name, value: variableState.id })) ?? []),
    ];
  }, [variableStates]);

  const onSelect = (value: string | null) => {
    if (!value || value === selectedPersonaID) {
      updatePrototype({ selectedPersonaID: null });
      return;
    }

    const variableStateID = [ALL, ...variableStates].find(({ id }) => id === value)?.id;
    if (!variableStateID) return;

    updatePrototype({ selectedPersonaID: variableStateID });
  };

  const value = personas.find((variableState) => variableState.id === selectedPersonaID);

  const optionLookup = React.useMemo(
    () => Object.fromEntries(personas.map((option) => [option.id, option.name])),
    [personas]
  );

  const isSearchable = options?.length > 5;

  const getOptionLabel: GetOptionLabel<string> = React.useCallback(
    (optionValue) => (optionValue ? optionLookup[optionValue] : null),
    [value]
  );
  const getOptionValue: GetOptionValue<PersonaOption, string> = React.useCallback(
    (option) => option?.value ?? null,
    []
  );

  const onEdit = React.useCallback(async (option: PersonaOption) => {
    if (!option) return;
    preventClose();
    await variableStateManageModal.openVoid({ variableStateID: option.value });
    enableClose();
  }, []);

  return (
    <Select
      placeholder="Select or create a test persona"
      searchable={isSearchable}
      value={value?.id ?? null}
      getOptionKey={(option) => option.value}
      getOptionValue={getOptionValue}
      getOptionLabel={getOptionLabel}
      inDropdownSearch={isSearchable}
      alwaysShowCreate
      createInputPlaceholder="test persona"
      options={options}
      onSelect={onSelect}
      renderEmpty={({ search }) =>
        !search && (
          <Box.FlexColumn alignContent="center" px="24px" pt="20px">
            <Text color="#132144" fontWeight="600" mb="4px">
              No persona exists
            </Text>
            <Box fontSize="13px" textAlign="center">
              Define preset variables for specific scenarios or use cases when testing your project
            </Box>
            <Box py="11px">
              <System.Link.Anchor href={PERSONAS_LEARN_MORE} color="#3D82E2">
                Learn more
              </System.Link.Anchor>
            </Box>
          </Box.FlexColumn>
        )
      }
      renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue) => (
        <S.OverflowWrapper>
          <OverflowText
            style={{
              display: 'block',
              overflow: 'hidden',
              ...(option.value === value?.id ? { textDecoration: 'underline' } : {}),
            }}
          >
            <span> {getNestedMenuFormattedLabel(getOptionLabel(getOptionValue(option)), searchLabel)}</span>
          </OverflowText>
          {option.value !== ALL.id && (
            <SvgIcon icon="edit" variant={SvgIcon.Variant.STANDARD} onClick={() => onEdit(option)} />
          )}
        </S.OverflowWrapper>
      )}
      renderFooterAction={() => (
        <Menu.Footer>
          <Menu.Footer.Action onClick={onCreateVariableState}>Create New</Menu.Footer.Action>
        </Menu.Footer>
      )}
    />
  );
};

export default PersonasSelect;
