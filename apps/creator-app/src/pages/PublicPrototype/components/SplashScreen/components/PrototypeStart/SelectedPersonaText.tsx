import { Box, System, Text } from '@voiceflow/ui';
import React from 'react';

import * as Prototype from '@/ducks/prototype';
import { useSelector } from '@/hooks';
import { SettingsContext } from '@/pages/PublicPrototype/context';

import PersonaSelectMenu from './PersonaSelectMenu';

const SelectedPersonaText: React.FC = () => {
  const selectedPersonaID = useSelector(Prototype.prototypeSelectedPersonaID);
  const settings = React.useContext(SettingsContext);

  const selectedPersonaName = React.useMemo(
    () => settings.variableStates.find(({ id }) => selectedPersonaID === id)?.name,
    [settings?.variableStates, selectedPersonaID]
  );

  if (!selectedPersonaName) return null;

  return (
    <PersonaSelectMenu
      render={({ ref, toggleSelectMenuOpen }) => (
        <Box textAlign="left">
          <Text fontSize={13} color="#62778c" lineHeight={1.54}>
            Running test on{' '}
            <System.Link.Anchor
              onClick={toggleSelectMenuOpen}
              style={{ borderBottom: '1px dotted #5d9df5' }}
              ref={ref as React.RefObject<HTMLAnchorElement>}
            >
              {selectedPersonaName}
            </System.Link.Anchor>
          </Text>
        </Box>
      )}
    />
  );
};

export default SelectedPersonaText;
