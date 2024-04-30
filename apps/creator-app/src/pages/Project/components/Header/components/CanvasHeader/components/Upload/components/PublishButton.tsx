import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { Box, Button, SvgIcon, Text, TippyTooltip } from '@voiceflow/ui';
import { Header, TooltipWithKeys, useTooltipModifiers } from '@voiceflow/ui-next';
import React from 'react';

import { useFeature } from '@/hooks/feature';

interface GeneralUploadButtonProps {
  onClick: VoidFunction;
  loading: boolean;
  progress: number;
}

const PublishButton: React.FC<GeneralUploadButtonProps> = ({ loading, progress, onClick }) => {
  const cmsWorkflows = useFeature(FeatureFlag.CMS_WORKFLOWS);
  const modifiers = useTooltipModifiers([{ name: 'offset', options: { offset: [0, 11] } }]);

  if (cmsWorkflows.isEnabled) {
    return (
      <TooltipWithKeys
        text="Publishing"
        hotkeys={[{ label: `${progress || 0}%` }]}
        modifiers={modifiers}
        placement="bottom"
        referenceElement={({ ref, onOpen, onClose }) => (
          <Header.Button.Secondary
            ref={ref}
            label="Publish"
            onClick={onClick}
            disabled={loading}
            isLoading={loading}
            onPointerEnter={loading ? onOpen : undefined}
            onPointerLeave={onClose}
          />
        )}
      />
    );
  }

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
