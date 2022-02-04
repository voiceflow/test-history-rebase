import { Box, Button, FlexCenter, Link, Text } from '@voiceflow/ui';
import React from 'react';
import styled from 'styled-components';

const UploadedContainer = styled(Box)`
  height: 100%;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

interface UploadedProps {
  redirectUrl: string;
  learnMoreUrl: string;
  buttonText: string;
  description: string;
}

const UploadedStage: React.FC<UploadedProps> = ({ redirectUrl, learnMoreUrl, buttonText, description }) => {
  return (
    <UploadedContainer>
      <FlexCenter fullWidth>
        <Text textAlign="center" mb={20} fontSize={15} lineHeight="22px" color="#132144">
          {description}. <Link href={learnMoreUrl}>Learn more</Link>
        </Text>
      </FlexCenter>
      <FlexCenter fullWidth>
        <Link href={redirectUrl} target="_blank" rel="noopener noreferrer">
          <Button>{buttonText}</Button>
        </Link>
      </FlexCenter>
    </UploadedContainer>
  );
};

export default UploadedStage;
