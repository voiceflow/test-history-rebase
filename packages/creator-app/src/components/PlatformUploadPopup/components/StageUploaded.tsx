import { Box, Button, Link, Text } from '@voiceflow/ui';
import React from 'react';

import { takeoffGraphic } from '@/assets';
import { styled } from '@/hocs/styled';

const UploadedContainer = styled(Box)`
  width: 300px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

interface UploadedProps {
  redirectUrl: string;
  learnMoreUrl?: string;
  buttonText: string;
  description: string;
  image?: string;
}

const UploadedStage: React.FC<UploadedProps> = ({ redirectUrl, learnMoreUrl, buttonText, description, image = takeoffGraphic }) => {
  return (
    <UploadedContainer>
      <img alt="takeoff" height={104} src={image} />
      <Text mt={16} mb={8} lineHeight="22px" color="#132144" fontWeight={600}>
        Successfully Uploaded
      </Text>
      <Text textAlign="center" mb={20} lineHeight="22px" color="#62778C">
        {description}. {learnMoreUrl && <Link href={learnMoreUrl}>Learn more</Link>}
      </Text>
      <Link href={redirectUrl} target="_blank" rel="noopener noreferrer">
        <Button squareRadius>{buttonText}</Button>
      </Link>
    </UploadedContainer>
  );
};

export default UploadedStage;
