import React from 'react';

import IconButton from '@/components/IconButton';
import Tooltip from '@/components/TippyTooltip';
import { usePermission } from '@/hooks';

import { CanvasControlMetaProps } from '../constants';
import ControlContainer from './ControlContainer';

type CanvasControlButtonTypes = Partial<CanvasControlMetaProps> & {
  onClick: () => void;
  iconProps?: any;
};

const CanvasControlButton: React.FC<CanvasControlButtonTypes> = ({ title, permission, hotkey, onClick, icon, iconProps }) => {
  const [canUseControlButton] = usePermission(permission);

  if (!canUseControlButton) return null;

  return (
    <ControlContainer>
      <Tooltip distance={6} title={title} position="top" hotkey={hotkey}>
        <IconButton icon={icon} onClick={onClick} {...iconProps} />
      </Tooltip>
    </ControlContainer>
  );
};

export default CanvasControlButton;
