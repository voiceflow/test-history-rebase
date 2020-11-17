import React from 'react';
import BaseConfetti from 'react-dom-confetti';

import AlertMessage from '@/components/AlertMessage';
import Box from '@/components/Box';
import Flex, { FlexCenter } from '@/components/Flex';
import { BlockText, Link, Text } from '@/components/Text';
import * as Account from '@/ducks/account';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { AlexaPublishJob, JobStageData } from '@/models';
import { ConnectedProps } from '@/types';

import { StageContainer, Video } from '../../components';

type UploadedProps = {
  stageData: JobStageData<AlexaPublishJob.SuccessStage>;
};

const Uploaded: React.FC<UploadedProps & UploadedConnectedProps> = ({ stageData, locales, userID, invocationName, updateAlexaPublishInfo }) => {
  const { succeededLocale, amazonID, selectedVendorID } = stageData;

  const firstSession = React.useMemo(() => localStorage.getItem(`is_first_session_${userID}`) !== 'false', []);

  React.useEffect(() => {
    localStorage.setItem(`is_first_session_${userID}`, 'false');
  }, []);

  React.useEffect(() => {
    updateAlexaPublishInfo({ amznID: amazonID, vendorId: selectedVendorID });
  }, [amazonID]);

  // eslint-disable-next-line no-case-declarations
  const locale = (succeededLocale || locales[0] || 'en-US').replace('-', '_');

  if (firstSession) {
    return (
      <StageContainer>
        <Flex>
          <Text mb={11} fontWeight={600} fontSize={15} color="#279745">
            Upload Successful
          </Text>
        </Flex>

        <Video link="https://s3.amazonaws.com/com.getvoiceflow.videos/loomopt.mp4" />

        <BlockText color="#62778c" mt={16} textAlign="center">
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
        <Text mb={11} fontWeight={600} fontSize={15} color="#279745">
          Upload Successful
        </Text>
      </FlexCenter>

      <BlockText color="#62778c" mb={16}>
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
