import { Banner } from '@voiceflow/ui';
import React from 'react';

import SampleEditor from '@/components/CodePreview/Samples';
import * as Settings from '@/components/Settings';
import { GENERAL_RUNTIME_ENDPOINT } from '@/config';
import { DIALOG_MANAGER_API } from '@/config/documentation';
import { useSetup, useTrackingEvents } from '@/hooks';
import { openInternalURLInANewTab } from '@/utils/window';

import KeySection, { KeyState } from './KeySection';
import { getSamples } from './utils';

const API: React.FC = () => {
  const [keyState, setKeyState] = React.useState<KeyState | null>();
  const samples = getSamples(GENERAL_RUNTIME_ENDPOINT, (keyState?.showPrimaryKey && keyState.primaryKey?.key) || '');

  const [trackingEvents] = useTrackingEvents();

  useSetup(() => {
    trackingEvents.trackActiveProjectApiPage();
  });

  return (
    <Settings.PageContent>
      <Settings.Section>
        <Banner
          small
          title="Run your assistant via API"
          onClick={() => openInternalURLInANewTab(DIALOG_MANAGER_API)}
          subtitle="Make your assistant accessible on any channel or interface."
          buttonText="See Usecases"
        />
      </Settings.Section>

      <KeySection page="Dialog Management API" syncKeyState={setKeyState} />

      <Settings.Section title="API Call Examples">
        <SampleEditor samples={samples} />
      </Settings.Section>
    </Settings.PageContent>
  );
};

export default API;
