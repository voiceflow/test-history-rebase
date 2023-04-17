import { Box, logger, Text, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import { uploadFail } from '@/assets';
import { StageComponentProps } from '@/platforms/types';

const ErrorStage: React.FC<StageComponentProps<any>> = ({ stage }) => {
  React.useEffect(() => {
    logger.error(stage);
  }, []);

  return (
    <Box.FlexCenter flexDirection="column" p={24} width={300}>
      <Box.FlexCenter size={104} borderRadius="50%" backgroundColor="#fee7ec">
        <img alt="takeoff" height={80} src={uploadFail} />
      </Box.FlexCenter>
      <Text mt={16} mb={8} color={ThemeColor.PRIMARY} fontWeight={600}>
        Assistant failed to upload
      </Text>
      <Text textAlign="center" mb={20} color={ThemeColor.SECONDARY}>
        Please wait a moment and try again. If the issue continues please contact our support team.
      </Text>
    </Box.FlexCenter>
  );
};

export default ErrorStage;
