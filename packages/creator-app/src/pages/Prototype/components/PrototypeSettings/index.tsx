import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as Recent from '@/ducks/recent';
import { connect } from '@/hocs';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { Drawer } from '../PrototypeContainer';
import SettingsSection from './components/SettingsSection';

const PrototypeSettings: React.FC<ConnectedPrototypeSettingsProps> = ({ config, updateSettings }) => {
  const toggleDebug = () => updateSettings({ debug: !config.debug });
  const toggleIntentScore = () => updateSettings({ intent: !config.intent });
  const toggleGuidedNav = () => updateSettings({ guided: !config.guided });

  return (
    <Drawer id={Identifier.PROTO_SETTINGS_MENU_CONTAINER}>
      <Section header="TEST SETTINGS" variant={SectionVariant.PROTOTYPE} />
      <SettingsSection header="Debug Mode" toggle={toggleDebug} value={config.debug}>
        Show the paths, variables and flows you're using while you test
      </SettingsSection>
      <SettingsSection header="Intent Confidence Score" toggle={toggleIntentScore} value={config.intent} isDividerNested>
        Show the natural language model's confidence out of 1.00 when matching trained intents.
      </SettingsSection>
      <SettingsSection header="Guided Navigation" toggle={toggleGuidedNav} value={config.guided} isDividerNested>
        Stop and wait for path selection on IF and Custom Action steps.
      </SettingsSection>
    </Drawer>
  );
};

const mapStateToProps = {
  config: Recent.recentPrototypeSelector,
};

const mapDispatchToProps = {
  updateSettings: Recent.updateRecentPrototype,
};

type ConnectedPrototypeSettingsProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeSettings) as React.FC;
