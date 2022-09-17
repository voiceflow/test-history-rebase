import { BoxFlex, Text } from '@voiceflow/ui';
import React from 'react';

import PlatformUploadPopup from '@/components/PlatformUploadPopup';
import { getPlatformContent } from '@/components/PlatformUploadPopup/constants';
import { ExportContext } from '@/contexts';
import * as ProjectV2 from '@/ducks/projectV2';
import { useAsyncMountUnmount, useDispatch, useSelector, useSetup, useToggle, useTrackingEvents } from '@/hooks';
import { isNotify, isReady, isRunning } from '@/utils/job';

import { ActionContainer, ContentContainer, ContentSection, Section } from '../components';
import { getPlatformSyncAction, getUploadButton, getUploadButtonV2, getUploadLink } from './constants';

const Export: React.FC = () => {
  const [open, toggleOpen] = useToggle(false);
  const { cancel, job, start } = React.useContext(ExportContext)!;
  const platform = useSelector(ProjectV2.active.platformSelector);
  const platformSyncAction = getPlatformSyncAction(platform);
  const syncPlatform = useDispatch(platformSyncAction);
  const PlatformUploadLink = getUploadLink(platform);
  const PlatformUploadButton = getUploadButton(platform);
  const PlatformUploadButtonV2 = getUploadButtonV2(platform);
  const PlatformUploadContent = getPlatformContent(platform);

  const [trackingEvents] = useTrackingEvents();

  const onClose = () => {
    toggleOpen(false);
    cancel();
  };

  const exportClick = () => {
    if (isReady(job)) {
      start();
      toggleOpen(false);
    } else {
      toggleOpen();
    }
  };

  useSetup(() => {
    trackingEvents.trackActiveProjectCodeExportPage();
  });

  useAsyncMountUnmount(async () => {
    await syncPlatform();
  });

  React.useEffect(() => {
    if (isNotify(job)) {
      toggleOpen(true);
    }
  }, [job?.status]);

  return (
    <ContentContainer>
      <ContentSection>
        <Section title="Runtime Export">
          <BoxFlex>
            <Text>
              <PlatformUploadLink />
            </Text>

            <ActionContainer>
              {PlatformUploadButtonV2 ? (
                <PlatformUploadButtonV2 />
              ) : (
                <>
                  <PlatformUploadButton isActive={isRunning(job)} onClick={exportClick} label="Export" />
                  <PlatformUploadPopup open={!isReady(job) && open} onClose={onClose}>
                    <PlatformUploadContent export />
                  </PlatformUploadPopup>
                </>
              )}
            </ActionContainer>
          </BoxFlex>
        </Section>
      </ContentSection>
    </ContentContainer>
  );
};

export default Export;
