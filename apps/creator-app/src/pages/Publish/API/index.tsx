import { Banner } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import { DIALOG_MANAGER_API } from '@/config/documentation';
import { useSetup, useTrackingEvents } from '@/hooks';
import { openInternalURLInANewTab } from '@/utils/window';

import KeySection from './KeySection';

const API: React.FC = () => {
  const [trackingEvents] = useTrackingEvents();

  useSetup(() => {
    trackingEvents.trackActiveProjectApiPage();
  });

  return (
    <Settings.PageContent>
      <Settings.Section>
        <Banner
          small
          title="Expand your capabilities"
          onClick={() => openInternalURLInANewTab(DIALOG_MANAGER_API)}
          subtitle="Connect to all your agent data with our suite of APIs."
          buttonText="See Usecases"
        />
      </Settings.Section>

      <KeySection page="Dialog Management API" />
    </Settings.PageContent>
  );
};

export default API;
