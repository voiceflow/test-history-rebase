import { ModelSensitivity as ModelSensitivityType } from '@voiceflow/alexa-types';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import Select from '@/components/Select';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useDidUpdateEffect } from '@/hooks';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { ConnectedProps } from '@/types';

type ModelSensitivityOwnProps = { platformMeta: PlatformSettingsMetaProps };

const OPTIONS = [
  { name: 'Low', value: ModelSensitivityType.LOW },
  { name: 'Medium', value: ModelSensitivityType.MEDIUM },
  { name: 'High', value: ModelSensitivityType.HIGH },
];

const ModelSensitivity: React.FC<ConnectedModelSensitivityProps & ModelSensitivityOwnProps> = ({
  settings,
  platformMeta,
  saveSettings,
  updateSettings,
}) => {
  useDidUpdateEffect(() => {
    saveSettings({ settings }, ['modelSensitivity']);
  }, [settings.modelSensitivity]);

  return (
    <Section
      header="Skill Model Sensitivity"
      variant={SectionVariant.QUATERNARY}
      dividers={false}
      contentSuffix={platformMeta.descriptors.modelSensitivity}
      customContentStyling={{ paddingBottom: '24px' }}
    >
      <Select
        placeholder="Model Sensitivity"
        value={settings.modelSensitivity ?? ModelSensitivityType.LOW}
        options={OPTIONS}
        onSelect={(value) => updateSettings({ modelSensitivity: value })}
        getOptionValue={(option) => option?.value || ModelSensitivityType.LOW}
        getOptionLabel={(value) => OPTIONS.find((option) => option.value === value)?.name ?? 'Low'}
      />
    </Section>
  );
};

const mapStateToProps = {
  settings: Skill.settingsSelector,
};

const mapDispatchToProps = {
  saveSettings: Skill.saveSettings,
  updateSettings: Skill.updateSettings,
};

type ConnectedModelSensitivityProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ModelSensitivity) as React.FC<ModelSensitivityOwnProps>;
