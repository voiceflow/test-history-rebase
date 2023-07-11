import { Box, createDividerMenuItemOption, Menu, Select, System, Text } from '@voiceflow/ui';
import React from 'react';

import { TEST_WITH_PERSONAS } from '@/constants';
import * as Prototype from '@/ducks/prototype';
import * as VariableState from '@/ducks/variableState';
import { useCreateVariableState, useDispatch, useSelector } from '@/hooks';

const ALL = { name: 'All personas', id: 'all' } as const;

const PersonasSelect: React.FC = () => {
  const variableStates = useSelector(VariableState.allVariableStatesSelector);
  const updatePrototype = useDispatch(Prototype.updatePrototype);
  const selectedPersonaID = useSelector(Prototype.prototypeSelectedPersonaID);
  const onCreateVariableState = useCreateVariableState();
  const personas = React.useMemo(() => [ALL, ...variableStates], [variableStates]);

  const options = React.useMemo(() => {
    if (!variableStates?.length) return [];

    return [ALL.name, createDividerMenuItemOption('divider'), ...(variableStates?.map((variableState) => variableState.name) ?? [])];
  }, [variableStates]);

  const onSelect = (selectedVariableStateName: string) => {
    const variableStateID = [ALL, ...variableStates].find((variableState) => variableState.name === selectedVariableStateName)?.id;
    if (!variableStateID) return;

    updatePrototype({ selectedPersonaID: variableStateID });
  };

  const variableStateName = personas.find((variableState) => variableState.id === selectedPersonaID)?.name;

  return (
    <Select
      placeholder="Select or create a test persona"
      searchable
      value={variableStateName}
      inDropdownSearch
      options={options}
      renderEmpty={() => (
        <Box.FlexColumn alignContent="center" px="24px" pt="20px">
          <Text color="#132144" fontWeight="600" mb="4px">
            No persona exists
          </Text>
          <Box fontSize="13px" textAlign="center">
            Define preset variables for specific scenarios or use cases when testing your project
          </Box>
          <Box py="11px">
            <System.Link.Anchor href={TEST_WITH_PERSONAS} color="#3D82E2">
              Learn more
            </System.Link.Anchor>
          </Box>
        </Box.FlexColumn>
      )}
      onSelect={onSelect}
      renderFooterAction={() => (
        <Menu.Footer>
          <Menu.Footer.Action onClick={onCreateVariableState}>Create New</Menu.Footer.Action>
        </Menu.Footer>
      )}
    />
  );
};

export default PersonasSelect;
