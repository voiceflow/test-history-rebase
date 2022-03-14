import { AlexaVersion } from '@voiceflow/alexa-types';
import { Select } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { connect } from '@/hocs';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { ConnectedProps } from '@/types';

interface ModelSensitivityOwnProps {
  platformMeta: PlatformSettingsMetaProps;
}
const OPTIONS = [
  { name: 'Low', value: AlexaVersion.ModelSensitivity.LOW },
  { name: 'Medium', value: AlexaVersion.ModelSensitivity.MEDIUM },
  { name: 'High', value: AlexaVersion.ModelSensitivity.HIGH },
];

const ModelSensitivity: React.FC<ConnectedModelSensitivityProps & ModelSensitivityOwnProps> = ({ modelSensitivity, platformMeta, patchSettings }) => (
  <Section
    header="Skill Model Sensitivity"
    variant={SectionVariant.QUATERNARY}
    dividers={false}
    contentSuffix={platformMeta.descriptors.modelSensitivity}
    customContentStyling={{ paddingBottom: '24px' }}
  >
    <Select
      value={modelSensitivity ?? AlexaVersion.ModelSensitivity.LOW}
      placeholder="Model Sensitivity"
      options={OPTIONS}
      onSelect={(value) => patchSettings({ modelSensitivity: value })}
      getOptionKey={(option) => option.value}
      getOptionValue={(option) => option?.value || AlexaVersion.ModelSensitivity.LOW}
      getOptionLabel={(value) => OPTIONS.find((option) => option.value === value)?.name ?? 'Low'}
    />
  </Section>
);

const mapStateToProps = {
  modelSensitivity: VersionV2.active.alexa.modelSensitivitySelector,
};

const mapDispatchToProps = {
  patchSettings: Version.alexa.patchSettings,
};

type ConnectedModelSensitivityProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(ModelSensitivity) as React.FC<ModelSensitivityOwnProps>;
