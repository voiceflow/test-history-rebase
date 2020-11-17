import React from 'react';

import { SectionToggleVariant, SectionVariant, UncontrolledSection } from '@/components/Section';
import { FeatureFlag } from '@/config/features';
import { PlatformType } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useFeature, useTeardown } from '@/hooks';
import { Alexa } from '@/pages/Settings/components/ContentDescriptors';
import { ConnectedProps } from '@/types';

const AlexaGadgetsToggle: React.FC<ConnectedAlexaGadgetsToggleProps> = ({ platform, settings, updateSettings, saveSettings }) => {
  const gadgets = useFeature(FeatureFlag.GADGETS);

  useTeardown(() => {
    saveSettings({ settings }, ['customInterface']);
  }, [settings]);

  return (
    <>
      {platform === PlatformType.ALEXA && gadgets.isEnabled && (
        <UncontrolledSection
          emptyChildren
          contentPrefix={Alexa.Gadgets}
          header="Custom Interface"
          headerToggle
          isCollapsed={!settings.customInterface}
          onClick={() => updateSettings({ customInterface: !settings.customInterface })}
          variant={SectionVariant.SECONDARY}
          collapseVariant={SectionToggleVariant.TOGGLE}
        />
      )}
    </>
  );
};

const mapStateToProps = {
  settings: Skill.settingsSelector,
  platform: Skill.activePlatformSelector,
};

const mapDispatchToProps = {
  updateSettings: Skill.updateSettings,
  saveSettings: Skill.saveSettings,
};

type ConnectedAlexaGadgetsToggleProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(AlexaGadgetsToggle);
