import { IconButton, TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

export interface AddButtonProps {
  tooltip?: TippyTooltipProps;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const AddButton: React.OldFC<AddButtonProps> = ({ tooltip, onClick }) => {
  const button = <IconButton size={16} icon="plus" onClick={onClick} variant={IconButton.Variant.BASIC} />;

  return tooltip ? (
    <TippyTooltip {...tooltip}>
      <IconButton size={16} icon="plus" onClick={onClick} variant={IconButton.Variant.BASIC} />
    </TippyTooltip>
  ) : (
    button
  );
};

export default AddButton;
