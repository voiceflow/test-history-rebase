import { Box, Button, SvgIcon, Text, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

interface GeneralUploadButtonProps {
  loading: boolean;
  progress: number;
  onClick: () => any;
}

const PublishButton: React.FC<GeneralUploadButtonProps> = ({ loading, progress, onClick }) => {
  return (
    <TippyTooltip
      disabled={!loading}
      content={
        <>
          Publishing:
          <Text ml="7px" color="rgba(255, 255, 255, 0.59)">
            {progress || 0}%
          </Text>
        </>
      }
      position="bottom"
    >
      <Button squareRadius flat onClick={loading ? undefined : onClick}>
        <Box.FlexCenter>
          <SvgIcon icon="arrowSpin" spin={loading} />
          <Box ml={12}>Publish</Box>
        </Box.FlexCenter>
      </Button>
    </TippyTooltip>
  );
};

export default PublishButton;
