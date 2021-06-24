import { IconButton, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { usePermission } from '@/hooks';

import { CanvasControlMetaProps } from '../constants';
import ControlContainer from './ControlContainer';

type CanvasControlButtonTypes = Partial<CanvasControlMetaProps> & {
  onClick: () => void;
  iconProps?: any;
  className?: string;
};

const CanvasControlButton: React.FC<CanvasControlButtonTypes> = ({ title, permission, hotkey, onClick, icon, iconProps, className }) => {
  const [canUseControlButton] = usePermission(permission);

  if (!canUseControlButton) return null;

  return (
    <TippyTooltip distance={8} title={title} position="top" hotkey={hotkey}>
      <ControlContainer className={className}>
        <IconButton icon={icon} onClick={onClick} {...iconProps} />
      </ControlContainer>
    </TippyTooltip>
  );
};

export default CanvasControlButton;
