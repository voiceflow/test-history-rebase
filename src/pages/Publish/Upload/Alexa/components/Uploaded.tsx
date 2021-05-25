import React from 'react';
import Confetti from 'react-dom-confetti';
import { ThemeContext } from 'styled-components';

import { FlexStart } from '@/components/Flex';
import Section from '@/components/Section';
import { BlockText, Link, Text } from '@/components/Text';
import * as Project from '@/ducks/project';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { AlexaPublishJob, JobStageData } from '@/models';
import { ConnectedProps } from '@/types';

import { DropdownSection, StageContainer, StageHeader } from '../../components';

type UploadedProps = {
  stageData: JobStageData<AlexaPublishJob.SuccessStage>;
};

const Uploaded: React.FC<UploadedProps & UploadedConnectedProps> = ({ stageData, locales, updateActiveVendor }) => {
  const { succeededLocale, amazonID, selectedVendorID } = stageData;

  const theme = React.useContext(ThemeContext);

  React.useEffect(() => {
    if (!selectedVendorID) return;

    updateActiveVendor(selectedVendorID, amazonID);
  }, [amazonID]);

  const locale = (succeededLocale || locales[0] || 'en-US').replace('-', '_');

  return (
    <StageContainer padding="22px 0 22px 32px">
      <FlexStart>
        <StageHeader>Successfully uploaded</StageHeader>
      </FlexStart>
      <FlexStart>
        <Text textAlign="left" mb={12} pr={32} fontSize={15} lineHeight="22px" color="#132144">
          Your Skill is now ready for the testing on the{' '}
          <Link href={`https://developer.amazon.com/alexa/console/ask/test/${amazonID}/development/${locale}/`}>Alexa Developer Console</Link>, or on
          your personal Alexa enabled device.
        </Text>
      </FlexStart>

      <DropdownSection title="Testing on Console">
        Alexa provides a skill simulator in the Alexa Developer Console. This allows you to test your skill without a physical device. You can
        interact with either your voice or text.
      </DropdownSection>

      <DropdownSection title="Testing on Echo Device">
        <BlockText>
          To test your skill with an Alexa-enabled device (such as an Amazon Echo), make sure the device is registered with the same email address you
          used to sign up for your Alexa Developer Account. Make sure that the locale of your device matches at least one of the locales available for
          your skill.
          <br />
          <br />
          You can then invoke your skill with the wake word and your invocation name:
          <br />
          <br />
          <Text color={theme.colors.secondary} fontWeight={600}>
            Examples:
          </Text>
          <BlockText>- "Alexa, open {'{invocation name}'}."</BlockText>
          <BlockText>- "Alexa, start {'{invocation name}'}."</BlockText>
        </BlockText>
      </DropdownSection>
      <Section forceDividers />
      <div id="confetti-positioner">
        <Confetti
          active={true}
          config={{
            angle: 90,
            spread: 70,
            elementCount: 75,
            startVelocity: 50,
          }}
        />
      </div>
    </StageContainer>
  );
};

const mapStateToProps = {
  locales: Version.activeLocalesSelector,
};

const mapDispatchToProps = {
  updateActiveVendor: Project.alexa.updateActiveVendor,
};

export type UploadedConnectedProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Uploaded) as React.FC<UploadedProps>;
