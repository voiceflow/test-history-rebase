import React from 'react';

import { SectionToggleVariant, SectionVariant, UncontrolledSection } from '@/components/Section';
import { FeatureFlag } from '@/config/features';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useFeature, useTeardown } from '@/hooks';
import { Alexa } from '@/pages/Settings/components/ContentDescriptors';
import { ConnectedProps } from '@/types';

type AlexaGadgetsToggleOwnProps = {
  modelSensitivityShown?: boolean;
};

const AlexaGadgetsToggle: React.FC<AlexaGadgetsToggleOwnProps & ConnectedAlexaGadgetsToggleProps> = ({
  settings,
  updateSettings,
  saveSettings,
  modelSensitivityShown,
}) => {
  const gadgets = useFeature(FeatureFlag.GADGETS);

  useTeardown(() => {
    saveSettings({ settings }, ['customInterface']);
  }, [settings]);

  return (
    <>
      {gadgets.isEnabled && (
        <UncontrolledSection
          emptyChildren
          contentPrefix={Alexa.Gadgets}
          header="Custom Interface"
          headerToggle
          dividers={modelSensitivityShown}
          isDividerNested
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
};

const mapDispatchToProps = {
  saveSettings: Skill.saveSettings,
  updateSettings: Skill.updateSettings,
};

type ConnectedAlexaGadgetsToggleProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(AlexaGadgetsToggle) as React.FC<AlexaGadgetsToggleOwnProps>;
