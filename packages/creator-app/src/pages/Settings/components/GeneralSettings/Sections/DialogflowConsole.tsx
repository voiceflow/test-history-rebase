import { Box, Input } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig, useDispatch, useLinkedState, useSelector } from '@/hooks';
import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';

// TODO: refactor this to make it platform agnostic
const DialogflowConsole: React.FC = () => {
  const projectConfig = useActiveProjectTypeConfig();

  const storedInvocationNameSamples = useSelector(VersionV2.active.invocationNameSamplesSelector);

  const [invocationNameSample, setInvocationNameSample] = useLinkedState(storedInvocationNameSamples[0] ?? 'Hello');

  const patchPublishing = useDispatch(Version.patchPublishing);

  const saveSettings = async () => patchPublishing({ invocationNameSamples: [invocationNameSample, ...storedInvocationNameSamples.slice(1)] });

  return (
    <>
      {!!projectConfig.project.invocationName && (
        <Section
          header={projectConfig.project.invocationName.samplesName}
          variant={SectionVariant.QUATERNARY}
          contentSuffix={<DescriptorContainer>{projectConfig.project.invocationName.description}</DescriptorContainer>}
          customContentStyling={{ paddingBottom: '24px' }}
        >
          <Box.Flex>
            <Input
              value={invocationNameSample}
              onBlur={saveSettings}
              placeholder={projectConfig.project.invocationName.placeholder}
              onChangeText={setInvocationNameSample}
            />
          </Box.Flex>
        </Section>
      )}
    </>
  );
};

export default DialogflowConsole;
