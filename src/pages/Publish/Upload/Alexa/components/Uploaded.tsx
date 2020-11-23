import React from 'react';
import BaseConfetti from 'react-dom-confetti';
import { ThemeContext } from 'styled-components';

import AlertMessage from '@/components/AlertMessage';
import Box from '@/components/Box';
import Flex, { FlexCenter, FlexStart } from '@/components/Flex';
import Section from '@/components/Section';
import { BlockText, Link, Text } from '@/components/Text';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { AlexaPublishJob, JobStageData } from '@/models';
import { ConnectedProps } from '@/types';

import { DropdownSection, StageContainer, StageHeader, Video } from '../../components';

type UploadedProps = {
  stageData: JobStageData<AlexaPublishJob.SuccessStage>;
};

const Uploaded: React.FC<UploadedProps & UploadedConnectedProps> = ({ stageData, locales, userID, invocationName, updateAlexaPublishInfo }) => {
  const headerRedesign = useFeature(FeatureFlag.HEADER_REDESIGN);

  const { succeededLocale, amazonID, selectedVendorID } = stageData;

  const firstSession = React.useMemo(() => localStorage.getItem(`is_first_session_${userID}`) !== 'false', []);

  const theme = React.useContext(ThemeContext);

  React.useEffect(() => {
    localStorage.setItem(`is_first_session_${userID}`, 'false');
  }, []);

  React.useEffect(() => {
    updateAlexaPublishInfo({ amznID: amazonID, vendorId: selectedVendorID });
  }, [amazonID]);

  // eslint-disable-next-line no-case-declarations
  const locale = (succeededLocale || locales[0] || 'en-US').replace('-', '_');

  if (headerRedesign.isEnabled) {
    return (
      <StageContainer padding="22px 0 22px 32px">
        <FlexStart>
          <StageHeader>Successfully uploaded</StageHeader>
        </FlexStart>
        <FlexStart>
          <Text textAlign="left" mb={12} pr={32} fontSize={15} lineHeight="22px" color="#132144">
            Your Skill is now ready for the testing on the{' '}
            <Link href={`https://developer.amazon.com/alexa/console/ask/test/${amazonID}/development/${locale}/`}>Alexa Developer Console</Link>, or
            on your personal Alexa enabled device.
          </Text>
        </FlexStart>

        <DropdownSection title="Testing on Console">
          Alexa provides a skill simulator in the Alexa Developer Console. This allos you to test your skill without a physical device. You can
          interact with either your voice or text.
        </DropdownSection>

        <DropdownSection title="Testing on Echo Device">
          <BlockText>
            To test your skill with an Alexa-enabled device (such as an Amazon Echo), make sure the device is registered with the same email address
            you used to sign up for your Alexa Developer Account. Make sure that the locale of your device matches at least one of the locales
            available for your skill.
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
          <BaseConfetti
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
  }

  if (firstSession) {
    return (
      <StageContainer>
        <Flex>
          <Text mb={11} fontWeight={600} fontSize={15} color={theme.colors.green}>
            Upload Successful
          </Text>
        </Flex>

        <Video link="https://s3.amazonaws.com/com.getvoiceflow.videos/loomopt.mp4" />

        <BlockText color={theme.colors.secondary} mt={16} textAlign="center">
          You may test on the Alexa simulator or live on your personal Alexa device
        </BlockText>

        {!!succeededLocale && (
          <AlertMessage mb={0} mx={8} textAlign="center">
            Alexa, open {invocationName}
          </AlertMessage>
        )}

        <Box my={32}>
          <a
            href={`https://developer.amazon.com/alexa/console/ask/test/${amazonID}/development/${locale}/`}
            className="btn-primary mr-2 no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Test on Alexa Simulator
          </a>
        </Box>

        <div id="confetti-positioner">
          <BaseConfetti
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
  }

  return (
    <StageContainer>
      <FlexCenter className="upload-prompt-title">
        <Text mb={11} fontWeight={600} fontSize={15} color={theme.colors.green}>
          Upload Successful
        </Text>
      </FlexCenter>

      <BlockText color={theme.colors.secondary} mb={16}>
        Your Skill is now available to test on your Alexa and the{' '}
        <Link href={`https://developer.amazon.com/alexa/console/ask/test/${amazonID}/development/${locale}/`}>Amazon console</Link>.
      </BlockText>
    </StageContainer>
  );
};

const mapStateToProps = {
  userID: Account.userIDSelector,
  locales: Skill.activeLocalesSelector,
  invocationName: Skill.invNameSelector,
};

const mapDispatchToProps = {
  updateAlexaPublishInfo: Skill.updateAlexaPublishInfo,
};

export type UploadedConnectedProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Uploaded) as React.FC<UploadedProps>;
