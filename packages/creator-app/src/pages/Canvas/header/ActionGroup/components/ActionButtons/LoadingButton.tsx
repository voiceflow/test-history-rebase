import React from 'react';

import Box from '@/components/Box';
import IconButton, { IconButtonVariant } from '@/components/IconButton';
import TippyTooltip from '@/components/TippyTooltip';
import { useEnableDisable } from '@/hooks';
import { AlexaPublishJob, GooglePublishJob, Job } from '@/models';
import { PublishContext } from '@/pages/Skill/contexts';

export type LoadingButtonProps = {
  openTooltip?: boolean;
  spin?: boolean;
  active?: boolean;
};

const LoadingButton: React.FC<LoadingButtonProps> = ({ openTooltip = false, spin = true, active = false }) => {
  const [open, onEnable, onDisable] = useEnableDisable(false);

  const publish = React.useContext(PublishContext)!;

  // for type identification
  const job = publish.job as Job<AlexaPublishJob.ProgressStage | GooglePublishJob.ProgressStage>;

  return (
    <TippyTooltip
      open={open && openTooltip}
      html={
        <div>
          Uploading:<span style={{ color: 'rgba(255, 255, 255, 0.59)', marginLeft: '7px' }}>{job?.stage.data.progress || 0}%</span>
        </div>
      }
      position="bottom"
    >
      <Box onMouseEnter={onEnable} onMouseLeave={onDisable}>
        <IconButton iconProps={{ spin }} variant={IconButtonVariant.ACTION} icon="loader" large active={active} />
      </Box>
    </TippyTooltip>
  );
};

export default React.memo(LoadingButton);
