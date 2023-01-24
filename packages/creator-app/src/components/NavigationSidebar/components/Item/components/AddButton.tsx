import { IconButton, TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

export interface AddButtonProps {
  tooltip?: TippyTooltipProps;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const AddButton: React.FC<AddButtonProps> = ({ tooltip, onClick }) => {
  const button = <IconButton size={16} icon="plus" onClick={onClick} variant={IconButton.Variant.BASIC} color="#6E849A" />;

  return tooltip ? <TippyTooltip {...tooltip}>{button}</TippyTooltip> : button;
};

export default AddButton;
