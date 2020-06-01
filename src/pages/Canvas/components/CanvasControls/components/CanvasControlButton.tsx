import React from 'react';

import IconButton from '@/components/IconButton';
import Tooltip from '@/components/TippyTooltip';
import { usePermissions } from '@/contexts';

import { CanvasControlMetaProps } from '../constants';
import ControlContainer from './ControlContainer';

type CanvasControlButtonTypes = Partial<CanvasControlMetaProps> & {
  onClick: () => void;
  iconProps?: any;
};

const CanvasControlButton: React.FC<CanvasControlButtonTypes> = ({ title, featureID, hotkey, onClick, icon, iconProps }) => {
  const [canUseControlButton] = usePermissions(featureID);
  if (!canUseControlButton && featureID) {
    return null;
  }
  return (
    <ControlContainer>
      <Tooltip distance={6} title={title} position="top" hotkey={hotkey}>
        <IconButton icon={icon} onClick={onClick} {...iconProps} />
      </Tooltip>
    </ControlContainer>
  );
};

export default CanvasControlButton;
