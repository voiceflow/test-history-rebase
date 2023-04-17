import { Input } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig, useDispatch, useLinkedState, useSelector } from '@/hooks';

const DialogflowConsole: React.FC = () => {
  const projectConfig = useActiveProjectTypeConfig();

  const storedInvocationNameSamples = useSelector(VersionV2.active.invocationNameSamplesSelector);

  const [invocationNameSample, setInvocationNameSample] = useLinkedState(storedInvocationNameSamples[0] ?? 'Hello');

  const patchPublishing = useDispatch(Version.patchPublishing);

  const saveSettings = async () => patchPublishing({ invocationNameSamples: [invocationNameSample, ...storedInvocationNameSamples.slice(1)] });

  if (!projectConfig.project.invocationName) return null;

  return (
    <Settings.Section title="Dialogflow Console">
      <Settings.Card>
        <Settings.SubSection header={projectConfig.project.invocationName.samplesName} splitView>
          <Input
            value={invocationNameSample}
            onBlur={saveSettings}
            placeholder={projectConfig.project.invocationName.placeholder}
            onChangeText={setInvocationNameSample}
          />

          <Settings.SubSection.Description>{projectConfig.project.invocationName.description}</Settings.SubSection.Description>
        </Settings.SubSection>
      </Settings.Card>
    </Settings.Section>
  );
};

export default DialogflowConsole;
