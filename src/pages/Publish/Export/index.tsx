import React from 'react';

import { PlatformType } from '@/constants';
import * as Account from '@/ducks/account';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useAsyncMountUnmount, useToggle } from '@/hooks';
import Upload from '@/pages/Canvas/header/ActionGroup/components/AlexaUploadButton/Button';
import UploadPopup from '@/pages/Canvas/header/ActionGroup/components/UploadPopup';
import { Alexa, General, Google } from '@/pages/Publish/Upload';
import { ExportContext } from '@/pages/Skill/contexts';
import { ConnectedProps } from '@/types';
import { isNotify, isReady, isRunning } from '@/utils/job';
import { getPlatformValue } from '@/utils/platform';

import { ActionContainer, ContentContainer, ContentSection, LinkContainer, SpacingSection, Text } from '../components';
import Section from '../components/Section';

const Export: React.FC<ConnectedExportProps> = ({ platform, syncSelectedVendor }) => {
  const [open, toggleOpen] = useToggle(false);
  const { cancel, job, start } = React.useContext(ExportContext)!;

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

  useAsyncMountUnmount(async () => {
    await syncSelectedVendor();
  });

  React.useEffect(() => {
    if (isNotify(job)) {
      toggleOpen(true);
    }
  }, [job?.status]);

  const ExportPopup = getPlatformValue(platform, {
    [PlatformType.ALEXA]: Alexa,
    [PlatformType.GOOGLE]: Google,
    [PlatformType.GENERAL]: General,
  });

  return (
    <ContentContainer>
      <ContentSection>
        <Section title="Export">
          <Text>
            {getPlatformValue(platform, {
              [PlatformType.ALEXA]: (
                <>
                  Upload to Alexa and generate an executable project version to run on your own infrastructure.
                  <LinkContainer>
                    <a href="https://github.com/voiceflow/alexa-runtime#configurations" target="_blank" rel="noreferrer">
                      Learn More
                    </a>
                  </LinkContainer>
                </>
              ),
              [PlatformType.GOOGLE]: (
                <>
                  Upload to Google and generate an executable project version to run on your own infrastructure.
                  <LinkContainer>
                    <a href="https://github.com/voiceflow/google-runtime#configurations" target="_blank" rel="noreferrer">
                      Learn More
                    </a>
                  </LinkContainer>
                </>
              ),
              [PlatformType.GENERAL]: (
                <>
                  Generate an executable project version to run on your own infrastructure.
                  <LinkContainer>
                    <a href="https://github.com/voiceflow/general-runtime#configurations" target="_blank" rel="noreferrer">
                      Learn More
                    </a>
                  </LinkContainer>
                </>
              ),
            })}
          </Text>

          <ActionContainer>
            <Upload isActive={isRunning(job)} onClick={exportClick} label="Export" />

            <UploadPopup open={!isReady(job) && open} onClose={onClose}>
              <ExportPopup export />
            </UploadPopup>
          </ActionContainer>
        </Section>
      </ContentSection>
      <SpacingSection />
    </ContentContainer>
  );
};

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
};

const mapDispatchToProps = {
  syncSelectedVendor: Account.syncSelectedVendor,
};

type ConnectedExportProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Export);
