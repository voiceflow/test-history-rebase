import { Box, Button, Link, Text, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import { linkGraphic } from '@/assets';
import THEME from '@/styles/theme';

interface StageConfigurationRequiredProps extends React.PropsWithChildren {
  platformName?: string;
  buttonText?: string;
  description: string;

  redirectUrl?: string;
  redirectCallback?: VoidFunction;
}

const StageConfigurationRequired: React.FC<StageConfigurationRequiredProps> = ({
  platformName,
  description,
  buttonText,
  redirectUrl,
  redirectCallback,
  children,
}) => {
  const hasRedirect = redirectUrl || redirectCallback;

  return (
    <Box.FlexCenter flexDirection="column" p={24} width={300}>
      <Box.FlexCenter size={104} borderRadius="50%" backgroundColor={THEME.colors.skyBlue}>
        <img alt="link" height={70} src={linkGraphic} />
      </Box.FlexCenter>

      <Text mt={16} mb={8} color={ThemeColor.PRIMARY} fontWeight={THEME.font.weight.semibold}>
        Connect to {platformName}
      </Text>

      <Text textAlign="center" mb={20} color={ThemeColor.SECONDARY}>
        {description}
      </Text>

      {buttonText && hasRedirect && (
        <Link href={redirectUrl} width="100%">
          <Button onClick={redirectCallback} squareRadius fullWidth>
            {buttonText}
          </Button>
        </Link>
      )}

      {children}
    </Box.FlexCenter>
  );
};

export default StageConfigurationRequired;
