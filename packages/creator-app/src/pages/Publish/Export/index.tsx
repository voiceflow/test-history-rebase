import { PlatformType } from '@voiceflow/internal';
import { Box, BoxFlex, Link, Text } from '@voiceflow/ui';
import React from 'react';

import * as Account from '@/ducks/account';
import * as ProjectV2 from '@/ducks/projectV2';
import { connect } from '@/hocs';
import { useAsyncMountUnmount, useSetup, useToggle, useTrackingEvents } from '@/hooks';
import AlexaUploadButton from '@/pages/Canvas/header/ActionGroup/components/AlexaUploadGroup/Button';
import GoogleUploadButton from '@/pages/Canvas/header/ActionGroup/components/GoogleUploadGroup/Button';
import UploadButton from '@/pages/Canvas/header/ActionGroup/components/UploadButton';
import UploadPopup from '@/pages/Canvas/header/ActionGroup/components/UploadPopup';
import { Alexa, General, Google } from '@/pages/Publish/Upload';
import { ExportContext } from '@/pages/Skill/contexts';
import { ConnectedProps } from '@/types';
import { isNotify, isReady, isRunning } from '@/utils/job';
import { getPlatformValue } from '@/utils/platform';

import { ActionContainer, ContentContainer, ContentSection, Section } from '../components';

const Export: React.FC<ConnectedExportProps> = ({ platform, syncSelectedVendor }) => {
  const [open, toggleOpen] = useToggle(false);
  const { cancel, job, start } = React.useContext(ExportContext)!;

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
    if (platform !== PlatformType.ALEXA) return;

    await syncSelectedVendor();
  });

  React.useEffect(() => {
    if (isNotify(job)) {
      toggleOpen(true);
    }
  }, [job?.status]);

  const ExportPopup = getPlatformValue(
    platform,
    {
      [PlatformType.ALEXA]: Alexa,
      [PlatformType.GOOGLE]: Google,
    },
    General
  );

  return (
    <ContentContainer>
      <ContentSection>
        <Section title="Runtime Export">
          <BoxFlex>
            <Text>
              {getPlatformValue(
                platform,
                {
                  [PlatformType.ALEXA]: (
                    <>
                      Upload to Alexa and generate an executable project version to run on your own infrastructure.
                      <Box mt={10}>
                        <Link href="https://github.com/voiceflow/alexa-runtime#configurations">Learn More</Link>
                      </Box>
                    </>
                  ),
                  [PlatformType.GOOGLE]: (
                    <>
                      Upload to Google and generate an executable project version to run on your own infrastructure.
                      <Box mt={10}>
                        <Link href="https://github.com/voiceflow/google-runtime#configurations">Learn More</Link>
                      </Box>
                    </>
                  ),
                },
                <>
                  Generate an executable project version to run on your own infrastructure.
                  <Box mt={10}>
                    <Link href="https://github.com/voiceflow/general-runtime#configurations">Learn More</Link>
                  </Box>
                </>
              )}
            </Text>

            <ActionContainer>
              {getPlatformValue(
                platform,
                {
                  [PlatformType.ALEXA]: <AlexaUploadButton isActive={isRunning(job)} onClick={exportClick} label="Export" />,
                  [PlatformType.GOOGLE]: <GoogleUploadButton isActive={isRunning(job)} onClick={exportClick} label="Export" />,
                },
                <UploadButton isActive={isRunning(job)} onClick={exportClick} label="Export" />
              )}

              <UploadPopup open={!isReady(job) && open} onClose={onClose}>
                <ExportPopup export />
              </UploadPopup>
            </ActionContainer>
          </BoxFlex>
        </Section>
      </ContentSection>
    </ContentContainer>
  );
};

const mapStateToProps = {
  platform: ProjectV2.active.platformSelector,
};

const mapDispatchToProps = {
  syncSelectedVendor: Account.amazon.syncSelectedVendor,
};

type ConnectedExportProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Export);
