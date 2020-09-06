import React from 'react';

import * as AlexaPublish from '@/ducks/publish/alexa';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import Upload from '@/pages/Canvas/header/ActionGroup/components/Alexa/Upload';
import UploadPopup from '@/pages/Canvas/header/ActionGroup/components/UploadPopup';
import UploadAlexa from '@/pages/Publish/Upload/Alexa';
import { ConnectedProps } from '@/types';

import { ActionContainer, ContentContainer, ContentSection, LinkContainer, PlatformText, SpacingSection, Text } from '../components';
import Section from '../components/Section';

const UploadComponent: React.FC<any> = Upload;
const Stages = AlexaPublish.ALEXA_STAGES as any;
const States = AlexaPublish.ALEXA_STATES as any;

const Export: React.FC<ConnectedExportProps> = ({ alexaPublish, platform }) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const stageState = States[alexaPublish.stage];

    if (alexaPublish.stage === Stages.IDLE) {
      setOpen(false);
    } else if (stageState.end) {
      setOpen(true);
    }
  }, [alexaPublish.stage, alexaPublish.id]);

  return (
    <ContentContainer>
      <ContentSection>
        <Section title="Export">
          <Text>
            Upload to <PlatformText>{platform}</PlatformText> and generate an executable project version to run on your own infrastructure.
            <LinkContainer>
              <a href="https://docs.voiceflow.com/#/platform/the-canvas?id=code-export" target="_blank" rel="noreferrer">
                Learn More
              </a>
            </LinkContainer>
          </Text>
          <ActionContainer>
            <UploadComponent setPopup={setOpen} label="Export" options={{ export: true }} />
            <UploadPopup open={open} onClose={() => setOpen(false)}>
              <UploadAlexa />
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

type ConnectedExportProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Export);
