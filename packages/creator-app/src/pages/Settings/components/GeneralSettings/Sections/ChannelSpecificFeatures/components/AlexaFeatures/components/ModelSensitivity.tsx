import { ModelSensitivity as ModelSensitivityType } from '@voiceflow/alexa-types';
import { Select } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { ConnectedProps } from '@/types';

type ModelSensitivityOwnProps = { platformMeta: PlatformSettingsMetaProps };
const OPTIONS = [
  { name: 'Low', value: ModelSensitivityType.LOW },
  { name: 'Medium', value: ModelSensitivityType.MEDIUM },
  { name: 'High', value: ModelSensitivityType.HIGH },
];

const ModelSensitivity: React.FC<ConnectedModelSensitivityProps & ModelSensitivityOwnProps> = ({ modelSensitivity, platformMeta, saveSettings }) => (
  <Section
    header="Skill Model Sensitivity"
    variant={SectionVariant.QUATERNARY}
    dividers={false}
    contentSuffix={platformMeta.descriptors.modelSensitivity}
    customContentStyling={{ paddingBottom: '24px' }}
  >
    <Select
      placeholder="Model Sensitivity"
      value={modelSensitivity ?? ModelSensitivityType.LOW}
      options={OPTIONS}
      onSelect={(value) => saveSettings({ modelSensitivity: value })}
      getOptionValue={(option) => option?.value || ModelSensitivityType.LOW}
      getOptionLabel={(value) => OPTIONS.find((option) => option.value === value)?.name ?? 'Low'}
    />
  </Section>
);

const mapStateToProps = {
  modelSensitivity: Version.alexa.activeModelSensitivitySelector,
};

const mapDispatchToProps = {
  saveSettings: Version.alexa.saveSettings,
};

type ConnectedModelSensitivityProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(ModelSensitivity) as React.FC<ModelSensitivityOwnProps>;
