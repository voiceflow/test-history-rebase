import React from 'react';

import { SectionToggleVariant, SectionVariant, UncontrolledSection } from '@/components/Section';
import { FeatureFlag } from '@/config/features';
import { PlatformType } from '@/constants';
import { activePlatformSelector, saveMeta, settingsSelector, updateSettings } from '@/ducks/skill';
import { saveAlexaSettings } from '@/ducks/skill/sideEffectsV2';
import { connect } from '@/hocs';
import { useFeature, useTeardown } from '@/hooks';
import { Alexa } from '@/pages/SettingsV2/components/ContentDescriptors';

type Settings = {
  customInterface?: boolean;
};

type SettingsProps = {
  platform: PlatformType;
  settings: Settings;
  updateSettings: (settings: Settings) => void;
  saveMeta: (data: { settings: Settings }) => void;
  saveAlexaSettings: typeof saveAlexaSettings;
};

const AlexaGadgets: React.FC<SettingsProps> = ({ platform, settings, updateSettings, saveMeta, saveAlexaSettings }) => {
  const gadgets = useFeature(FeatureFlag.GADGETS);
  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);

  useTeardown(() => {
    if (dataRefactor.isEnabled) {
      saveAlexaSettings({ settings }, ['customInterface']);
    } else {
      saveMeta({ settings });
    }
  }, [settings]);

  return (
    <>
      {platform === PlatformType.ALEXA && gadgets.isEnabled && (
        <UncontrolledSection
          emptyChildren
          contentPrefix={Alexa.Gadgets}
          header="Alexa Gadgets"
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
  saveMeta,
  saveAlexaSettings,
};

export default connect(mapStateToProps, mapDispatchToProps)(AlexaGadgets);
