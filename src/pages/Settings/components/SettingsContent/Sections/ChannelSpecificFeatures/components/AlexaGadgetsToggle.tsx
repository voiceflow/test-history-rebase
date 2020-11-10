import React from 'react';

import { SectionToggleVariant, SectionVariant, UncontrolledSection } from '@/components/Section';
import { FeatureFlag } from '@/config/features';
import { PlatformType } from '@/constants';
import { activePlatformSelector, settingsSelector, updateSettings } from '@/ducks/skill';
import { saveSettings } from '@/ducks/skill/sideEffectsV2';
import { connect } from '@/hocs';
import { useFeature, useTeardown } from '@/hooks';
import { Alexa } from '@/pages/Settings/components/ContentDescriptors';

type Settings = {
  customInterface?: boolean;
};

type SettingsProps = {
  platform: PlatformType;
  settings: Settings;
  updateSettings: (settings: Settings) => void;
  saveMeta: (data: { settings: Settings }) => void;
  saveSettings: typeof saveSettings;
};

const AlexaGadgets: React.FC<SettingsProps> = ({ platform, settings, updateSettings, saveSettings }) => {
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
  settings: settingsSelector,
  platform: activePlatformSelector,
};

const mapDispatchToProps = {
  updateSettings,
  saveSettings,
};

export default connect(mapStateToProps, mapDispatchToProps)(AlexaGadgets);
