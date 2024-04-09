import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { Box, Button, SvgIcon, Text, TippyTooltip } from '@voiceflow/ui';
import { Header, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { TooltipContentHotKeys } from '@/components/Tooltip/TooltipContentHotKeys/TooltipContentHotKeys.component';
import { useFeature } from '@/hooks/feature';

interface GeneralUploadButtonProps {
  onClick: VoidFunction;
  loading: boolean;
  progress: number;
}

const PublishButton: React.FC<GeneralUploadButtonProps> = ({ loading, progress, onClick }) => {
  const cmsWorkflows = useFeature(FeatureFlag.CMS_WORKFLOWS);

  if (cmsWorkflows.isEnabled) {
    return (
      <Tooltip
        placement="bottom"
        referenceElement={({ ref, onOpen, onClose }) => (
          <div ref={ref}>
            <Header.Button.Secondary
              label="Publish"
              onClick={onClick}
              disabled={loading}
              isLoading={loading}
              onPointerEnter={loading ? onOpen : undefined}
              onPointerLeave={onClose}
            />
          </div>
        )}
      >
        {() => <TooltipContentHotKeys label="Publishing" hotkeys={[{ label: `${progress || 0}%` }]} />}
      </Tooltip>
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
