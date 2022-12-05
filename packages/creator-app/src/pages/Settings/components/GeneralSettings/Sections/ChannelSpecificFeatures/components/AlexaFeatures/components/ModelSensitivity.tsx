import { AlexaVersion } from '@voiceflow/alexa-types';
import { Select } from '@voiceflow/ui';
import React from 'react';

import { SettingsSubSection } from '@/components/Settings/components';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';

interface ModelSensitivityOwnProps {
  platformMeta: PlatformSettingsMetaProps;
}
const OPTIONS = [
  { name: 'Low', value: AlexaVersion.ModelSensitivity.LOW },
  { name: 'Medium', value: AlexaVersion.ModelSensitivity.MEDIUM },
  { name: 'High', value: AlexaVersion.ModelSensitivity.HIGH },
];

const ModelSensitivity: React.FC<ModelSensitivityOwnProps> = ({ platformMeta }) => {
  const modelSensitivity = useSelector(VersionV2.active.alexa.modelSensitivitySelector);
  const patchSettings = useDispatch(Version.alexa.patchSettings);

  return (
    <SettingsSubSection
      header="Skill Model Sensitivity"
      leftDescription={<DescriptorContainer>{platformMeta.descriptors.modelSensitivity}</DescriptorContainer>}
    >
      <Select
        value={modelSensitivity ?? AlexaVersion.ModelSensitivity.LOW}
        placeholder="Model Sensitivity"
        options={OPTIONS}
        onSelect={(value) => patchSettings({ modelSensitivity: value })}
        getOptionKey={(option) => option.value}
        getOptionValue={(option) => option?.value || AlexaVersion.ModelSensitivity.LOW}
        getOptionLabel={(value) => OPTIONS.find((option) => option.value === value)?.name ?? 'Low'}
        fullWidth
      />
    </SettingsSubSection>
  );
};
export default ModelSensitivity;
