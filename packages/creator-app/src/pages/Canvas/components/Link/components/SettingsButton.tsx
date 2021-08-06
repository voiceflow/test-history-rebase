import { Box, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import ButtonContainer from './SettingsButtonContainer';

interface SettingsButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  isActive?: boolean;
  isSimple?: boolean;
  tooltipTitle?: string;
  tooltipHotkey?: string;
}

const SettingsButton: React.ForwardRefRenderFunction<HTMLDivElement, SettingsButtonProps> = (
  { children, onClick, isActive, isSimple, tooltipTitle, tooltipHotkey },
  ref
) => (
  <Box ref={ref} p={8}>
    <TippyTooltip style={{ display: 'block' }} title={tooltipTitle} position="top" distance={6} hotkey={tooltipHotkey} disabled={!tooltipTitle}>
      <ButtonContainer onClick={onClick} isActive={isActive} isSimple={isSimple}>
        {children}
      </ButtonContainer>
    </TippyTooltip>
  </Box>
);

export default React.forwardRef<HTMLDivElement, SettingsButtonProps>(SettingsButton);
