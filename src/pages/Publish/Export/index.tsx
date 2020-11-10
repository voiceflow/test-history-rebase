import React from 'react';

import * as Account from '@/ducks/account';
import { syncSelectedVendor } from '@/ducks/account/sideEffectsV2';
import * as AlexaPublish from '@/ducks/publish/alexa';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useAsyncMountUnmount, useToggle } from '@/hooks';
import UploadV2 from '@/pages/Canvas/header/ActionGroup/components/AlexaUploadButtonV2/Button';
import UploadPopup from '@/pages/Canvas/header/ActionGroup/components/UploadPopup';
import { Alexa } from '@/pages/Publish/UploadV2';
import { ExportContext } from '@/pages/Skill/contexts';
import { ConnectedProps } from '@/types';
import { isNotify, isReady, isRunning } from '@/utils/job';

import { ActionContainer, ContentContainer, ContentSection, LinkContainer, PlatformText, SpacingSection, Text } from '../components';
import Section from '../components/Section';

const Stages = AlexaPublish.ALEXA_STAGES as any;
const States = AlexaPublish.ALEXA_STATES as any;

const Export: React.FC<ConnectedExportProps> = ({ alexaPublish, platform, syncSelectedVendor }) => {
  const [open, toggleOpen] = useToggle(false);
  const { cancel, job, start } = React.useContext(ExportContext)!;

  const onClose = () => {
    toggleOpen(false);
    cancel();
  };

  React.useEffect(() => {
    const stageState = States[alexaPublish.stage];

    if (alexaPublish.stage === Stages.IDLE) {
      toggleOpen(false);
    } else if (stageState.end) {
      toggleOpen(true);
    }
  }, [alexaPublish.stage, alexaPublish.id]);

  const exportV2Click = () => {
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

  return (
    <ContentContainer>
      <ContentSection>
        <Section title="Export">
          <Text>
            Upload to <PlatformText>{platform}</PlatformText> and generate an executable project version to run on your own infrastructure.
            <LinkContainer>
              <a href="https://github.com/voiceflow/alexa-client#configurations" target="_blank" rel="noreferrer">
                Learn More
              </a>
            </LinkContainer>
          </Text>

          <ActionContainer>
            <UploadV2 isActive={isRunning(job)} onClick={exportV2Click} label="Export" />

            <UploadPopup open={!isReady(job) && open} onClose={onClose}>
              <Alexa export />
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
  alexaPublish: AlexaPublish.publishStateSelector,
};

const mapDispatchToProps = {
  syncVendors: AlexaPublish.syncVendors,
  checkAmazonAccount: Account.checkAmazonAccount,
  syncSelectedVendor,
};

type ConnectedExportProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Export);
