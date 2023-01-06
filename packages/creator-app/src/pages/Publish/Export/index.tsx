import { BoxFlex, Text } from '@voiceflow/ui';
import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import { useAsyncMountUnmount, useDispatch, useSelector, useSetup, useTrackingEvents } from '@/hooks';

import { ActionContainer, ContentContainer, ContentSection, Section } from '../components';
import { getPlatformSyncAction, getUploadButton, getUploadLink } from './constants';

const Export: React.OldFC = () => {
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
    <ContentContainer>
      <ContentSection>
        <Section title="Runtime Export">
          <BoxFlex>
            <Text>
              <PlatformUploadLink />
            </Text>

            <ActionContainer>
              <PlatformUploadButton />
            </ActionContainer>
          </BoxFlex>
        </Section>
      </ContentSection>
    </ContentContainer>
  );
};

export default Export;
