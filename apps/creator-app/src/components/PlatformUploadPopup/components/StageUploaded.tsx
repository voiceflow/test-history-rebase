import { Box, Button, Link, Text, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import { uploaded } from '@/assets';

interface UploadedProps extends React.PropsWithChildren {
  title?: string;
  imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  redirectUrl?: string;
  learnMoreUrl?: string;
  buttonText?: string;
  description: string;
}

const UploadedStage: React.FC<UploadedProps> = ({
  title,
  imageProps,
  redirectUrl,
  learnMoreUrl,
  buttonText,
  description,
  children,
}) => {
  return (
    <Box.FlexCenter flexDirection="column" p={24} width={300}>
      <Box.FlexCenter size={104} borderRadius="50%" backgroundColor="#e3eff8">
        <img alt="takeoff" height={80} src={uploaded} {...imageProps} />
      </Box.FlexCenter>
      <Text mt={16} mb={8} color={ThemeColor.PRIMARY} fontWeight={600}>
        {title || 'Successfully Published'}
      </Text>
      <Text textAlign="center" mb={20} color={ThemeColor.SECONDARY}>
        {description}. {learnMoreUrl && <Link href={learnMoreUrl}>Learn more</Link>}
      </Text>
      {buttonText && redirectUrl && (
        <Link href={redirectUrl} width="100%">
          <Button squareRadius fullWidth>
            {buttonText}
          </Button>
        </Link>
      )}
      {children}
    </Box.FlexCenter>
  );
};

export default UploadedStage;
