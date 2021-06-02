import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as Recent from '@/ducks/recent';
import { connect } from '@/hocs';
import { useDebug } from '@/pages/Prototype/hooks';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { Drawer } from '../PrototypeContainer';
import SettingsSection from './components/SettingsSection';

const PrototypeSettings: React.FC<ConnectedPrototypeSettingsProps> = ({ settings, updateSettings }) => {
  const debugEnabled = useDebug();

  const toggleDebug = () => updateSettings({ debug: !debugEnabled });
  const toggleIntentScore = () => updateSettings({ intent: !settings.intent });
  const toggleGuidedNav = () => updateSettings({ guided: !settings.guided });

  return (
    <Drawer id={Identifier.PROTO_SETTINGS_MENU_CONTAINER}>
      <Section header="TEST SETTINGS" variant={SectionVariant.PROTOTYPE} />
      <SettingsSection header="Debug Mode" toggle={toggleDebug} value={debugEnabled}>
        Show the paths, variables and flows you're using while you test
      </SettingsSection>
      <SettingsSection header="Intent Confidence Score" toggle={toggleIntentScore} value={settings.intent} isDividerNested>
        Show the natural language model's confidence out of 1.00 when matching trained intents.
      </SettingsSection>
      <SettingsSection header="Guided Navigation" toggle={toggleGuidedNav} value={settings.guided} isDividerNested>
        Stop and wait for path selection on certain steps such as Custom Action.
      </SettingsSection>
    </Drawer>
  );
};

const mapStateToProps = {
  settings: Recent.recentPrototypeSelector,
};

const mapDispatchToProps = {
  updateSettings: Recent.updateRecentPrototype,
};

type ConnectedPrototypeSettingsProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeSettings) as React.FC;
