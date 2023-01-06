import { Input } from '@voiceflow/ui';
import React from 'react';

import { SectionVariants, SettingsSection, SettingsSubSection } from '@/components/Settings';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig, useDispatch, useLinkedState, useSelector } from '@/hooks';
import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';

// TODO: refactor this to make it platform agnostic
const DialogflowConsole: React.OldFC = () => {
  const projectConfig = useActiveProjectTypeConfig();

  const storedInvocationNameSamples = useSelector(VersionV2.active.invocationNameSamplesSelector);

  const [invocationNameSample, setInvocationNameSample] = useLinkedState(storedInvocationNameSamples[0] ?? 'Hello');

  const patchPublishing = useDispatch(Version.patchPublishing);

  const saveSettings = async () => patchPublishing({ invocationNameSamples: [invocationNameSample, ...storedInvocationNameSamples.slice(1)] });

  return (
    <>
      {!!projectConfig.project.invocationName && (
        <SettingsSection variant={SectionVariants.PRIMARY} marginBottom={40} title="Dialogflow Console">
          <SettingsSubSection
            header={projectConfig.project.invocationName.samplesName}
            leftDescription={<DescriptorContainer>{projectConfig.project.invocationName.description}</DescriptorContainer>}
          >
            <Input
              value={invocationNameSample}
              onBlur={saveSettings}
              placeholder={projectConfig.project.invocationName.placeholder}
              onChangeText={setInvocationNameSample}
            />
          </SettingsSubSection>
        </SettingsSection>
      )}
    </>
  );
};

export default DialogflowConsole;
