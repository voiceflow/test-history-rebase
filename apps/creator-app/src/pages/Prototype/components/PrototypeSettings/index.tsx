import { Box } from '@voiceflow/ui-next';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as Recent from '@/ducks/recent';
import { useDispatch, useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';

import SettingsSection from './components/SettingsSection';

interface PrototypeSettingsProps {
  showTitle?: boolean;
}

const PrototypeSettings: React.FC<PrototypeSettingsProps> = ({ showTitle }) => {
  const config = useSelector(Recent.recentPrototypeSelector);
  const updateSettings = useDispatch(Recent.updateRecentPrototype);
  const toggleSetting = (setting: keyof typeof config) => () => updateSettings({ [setting]: !config[setting] });

  return (
    <Box id={Identifier.PROTO_SETTINGS_MENU_CONTAINER} direction="column" overflow="hidden">
      {showTitle && <Section header="TEST SETTINGS" variant={SectionVariant.PROTOTYPE} />}
      <SettingsSection header="Debug Mode" toggle={toggleSetting('debug')} value={config.debug}>
        Show the paths, variables and components you're using while you test.
      </SettingsSection>
      <SettingsSection
        header="Intent Confidence Score"
        toggle={toggleSetting('intent')}
        value={config.intent}
        isDividerNested
      >
        Show the natural language model's confidence out of 1.00 when matching trained intents.
      </SettingsSection>
      <SettingsSection
        header="Guided Navigation"
        toggle={toggleSetting('isGuided')}
        value={config.isGuided}
        isDividerNested
      >
        Stop and wait for path selection on IF and Custom Action steps.
      </SettingsSection>
    </Box>
  );
};

export default PrototypeSettings;
