import { Box, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

interface WorkspaceDisabledTooltipProps {
  children: React.ReactNode;
  disabled?: boolean;
}

const WorkspaceDisabledTooltip: React.FC<WorkspaceDisabledTooltipProps> = ({ children, disabled }) =>
  disabled ? (
    <>{children}</>
  ) : (
    <TippyTooltip
      content={
        <Box width={195} textAlign="left">
          AI Assist features have been disabled for this workspace by a workspace admin.
        </Box>
      }
    >
      {children}
    </TippyTooltip>
  );

export default WorkspaceDisabledTooltip;
