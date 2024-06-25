import { AlexaVersion } from '@voiceflow/alexa-types';
import { Link, Select } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';

const OPTIONS = [
  { name: 'Low', value: AlexaVersion.ModelSensitivity.LOW },
  { name: 'Medium', value: AlexaVersion.ModelSensitivity.MEDIUM },
  { name: 'High', value: AlexaVersion.ModelSensitivity.HIGH },
];

const ModelSensitivity: React.FC = () => {
  const modelSensitivity = useSelector(VersionV2.active.alexa.modelSensitivitySelector);
  const patchSettings = useDispatch(VersionV2.alexa.patchSettings);

  return (
    <Settings.SubSection header="Skill Model Sensitivity" splitView>
      <Select
        value={modelSensitivity ?? AlexaVersion.ModelSensitivity.LOW}
        fullWidth
        options={OPTIONS}
        onSelect={(value) => patchSettings({ modelSensitivity: value })}
        placeholder="Model Sensitivity"
        getOptionKey={(option) => option.value}
        getOptionValue={(option) => option?.value || AlexaVersion.ModelSensitivity.LOW}
        getOptionLabel={(value) => OPTIONS.find((option) => option.value === value)?.name ?? 'Low'}
      />

      <Settings.SubSection.Description>
        As you increase the sensitivity, AMAZON.FallbackIntent captures more user utterances that aren't supported by
        your custom intents. By default, this is set to low.
        <Link href="https://developer.amazon.com/en-US/docs/alexa/custom-skills/standard-built-in-intents.html#adjust-sensitivity">
          Learn more.
        </Link>
      </Settings.SubSection.Description>
    </Settings.SubSection>
  );
};
export default ModelSensitivity;
