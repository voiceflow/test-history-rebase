import { Banner } from '@voiceflow/ui';
import React from 'react';

import SampleEditor from '@/components/CodePreview/Samples';
import * as Settings from '@/components/Settings';
import { GENERAL_RUNTIME_ENDPOINT } from '@/config';
import { openURLInANewTab } from '@/utils/window';

import KeySection, { KeyState } from '../API/KeySection';
import { getSamples } from './utils';

const KnowledgeBaseAPI: React.FC = () => {
  const [keyState, setKeyState] = React.useState<KeyState | null>();
  const samples = getSamples(GENERAL_RUNTIME_ENDPOINT, (keyState?.showPrimaryKey && keyState.primaryKey?.key) || '');

  return (
    <Settings.PageContent>
      <Settings.Section>
        <Banner
          small
          title="Interact with Knowledge Base via API"
          onClick={() => openURLInANewTab('https://developer.voiceflow.com/reference/post_knowledge-base-query')}
          subtitle="Learn how to use the Knowledge Base API using our docs."
          buttonText="Documentation"
        />
      </Settings.Section>

      <KeySection page="Knowledge Base API" syncKeyState={setKeyState} />

      <Settings.Section title="API Call Examples">
        <SampleEditor samples={samples} />
      </Settings.Section>
    </Settings.PageContent>
  );
};

export default KnowledgeBaseAPI;
