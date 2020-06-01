import React from 'react';

import { SectionToggleVariant, SectionVariant, UncontrolledSection } from '@/components/Section';
import { PlatformType } from '@/constants';
import { activePlatformSelector, saveMeta, settingsSelector, updateSettings } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useTeardown } from '@/hooks';

type Settings = {
  customInterface?: boolean;
};

type SettingsProps = {
  platform: PlatformType;
  settings: Settings;
  updateSettings: (settings: Settings) => void;
  saveMeta: (data: { settings: Settings }) => void;
};

const Settings: React.FC<SettingsProps> = ({ platform, settings, updateSettings, saveMeta }) => {
  useTeardown(() => {
    saveMeta({ settings });
  }, [settings]);

  return (
    <>
      {platform === PlatformType.ALEXA && (
        <UncontrolledSection
          header="Custom Interface"
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
  settings: settingsSelector,
  platform: activePlatformSelector,
};

const mapDispatchToProps = {
  updateSettings,
  saveMeta,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
