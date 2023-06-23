import { Banner } from '@voiceflow/ui';
import React from 'react';

import SampleEditor from '@/components/CodePreview/Samples';
import * as Settings from '@/components/Settings';
import { API_ENDPOINT } from '@/config';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { openURLInANewTab } from '@/utils/window';

import KeySection, { KeyState } from '../API/KeySection';
import { getSamples } from './utils';

const ProjectAPI: React.FC = () => {
  const [keyState, setKeyState] = React.useState<KeyState | null>();
  const versionID = useSelector(Session.activeVersionIDSelector);

  const samples = getSamples(versionID!, API_ENDPOINT, (keyState?.showPrimaryKey && keyState.primaryKey?.key) || '');

  return (
    <Settings.PageContent>
      <Settings.Section>
        <Banner
          small
          title="Export your assistant data via API"
          onClick={() => openURLInANewTab('https://developer.voiceflow.com/docs/exports')}
          subtitle="Convert your Assistant data into the format required for your NLU."
          buttonText="See Usecases"
        />
      </Settings.Section>

      <KeySection page="Project API" syncKeyState={setKeyState} />

      <Settings.Section title="API Call Examples">
        <SampleEditor samples={samples} />
      </Settings.Section>
    </Settings.PageContent>
  );
};

export default ProjectAPI;
