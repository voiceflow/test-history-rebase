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
import { GooglePublishJob, JobStageData } from '@/models';
import { ConnectedProps } from '@/types';

import { DropdownSection, StageContainer, StageHeader, Video } from '../../components';

type UploadedProps = {
  stageData: JobStageData<GooglePublishJob.SuccessStage>;
};

const Uploaded: React.FC<UploadedProps & UploadedConnectedProps> = ({ stageData, userID, invocationName }) => {
  const headerRedesign = useFeature(FeatureFlag.HEADER_REDESIGN);

  const { googleProjectID } = stageData;

  const firstSession = React.useMemo(() => localStorage.getItem(`is_first_session_${userID}`) !== 'false', []);

  const theme = React.useContext(ThemeContext);

  React.useEffect(() => {
    localStorage.setItem(`is_first_session_${userID}`, 'false');
  }, []);

  if (headerRedesign.isEnabled) {
    return (
      <StageContainer padding="22px 0 22px 32px">
        <FlexStart>
          <StageHeader>Successfully uploaded</StageHeader>
        </FlexStart>

        <FlexStart>
          <Text textAlign="left" mb={12} pr={32} fontSize={15} lineHeight="22px" color="#132144">
            Your action is now ready for the testing on the{' '}
            <Link href={`https://console.actions.google.com/project/${googleProjectID}/simulator/`}>Actions Console Simulator</Link>.
          </Text>
        </FlexStart>
        <DropdownSection title="Testing on Simulator">
          <Text textAlign="left" mb={0} fontSize={15} lineHeight="22px" color="#132144">
            Google provides an Actions simulator in the Actions Console. This allows you to test your Action using voice, text, or chip input.
          </Text>
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
          You may test on the Google Action simulator or live on your personal device
        </BlockText>

        <AlertMessage mb={0} mx={8} textAlign="center">
          Google, open {invocationName}
        </AlertMessage>

        <Box my={32}>
          <a
            href={`https://console.actions.google.com/project/${googleProjectID}/simulator/`}
            className="btn-primary mr-2 no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Test on Google Action Simulator
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
        Your Action is now available to test on your device and the{' '}
        <Link href={`https://console.actions.google.com/project/${googleProjectID}/simulator/`}>Google Actions console</Link>.
      </BlockText>
    </StageContainer>
  );
};

const mapStateToProps = {
  userID: Account.userIDSelector,
  locales: Skill.activeLocalesSelector,
  invocationName: Skill.invNameSelector,
};

export type UploadedConnectedProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps, null)(Uploaded) as React.FC<UploadedProps>;
