import { Box } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import * as ProjectV2 from '@/ducks/projectV2';
import { useAsyncMountUnmount, useDispatch, useSelector, useSetup, useTrackingEvents } from '@/hooks';

import { getPlatformSyncAction, getUploadButton, getUploadLink } from './constants';

const Export: React.FC = () => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const platformSyncAction = getPlatformSyncAction(platform);
  const syncPlatform = useDispatch(platformSyncAction);
  const PlatformUploadLink = getUploadLink(platform);
  const PlatformUploadButton = getUploadButton(platform);

  const [trackingEvents] = useTrackingEvents();

  useSetup(() => {
    trackingEvents.trackActiveProjectCodeExportPage();
  });

  useAsyncMountUnmount(async () => {
    await syncPlatform();
  });

  return (
    <Settings.PageContent>
      <Settings.Section>
        <Settings.Card>
          <Settings.SubSection contentProps={{ topOffset: 3 }}>
            <Box.FlexApart gap={24}>
              <div>
                <Settings.SubSection.Title>Runtime Export</Settings.SubSection.Title>

                <Settings.SubSection.Description>
                  <PlatformUploadLink />
                </Settings.SubSection.Description>
              </div>

              <PlatformUploadButton />
            </Box.FlexApart>
          </Settings.SubSection>
        </Settings.Card>
      </Settings.Section>
    </Settings.PageContent>
  );
};

export default Export;
