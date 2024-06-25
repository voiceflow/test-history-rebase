import type { TippyTooltipProps } from '@voiceflow/ui';
import { System, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

export interface AddButtonProps {
  tooltip?: TippyTooltipProps;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const AddButton: React.FC<AddButtonProps> = ({ tooltip, onClick }) => {
  const button = <System.IconButton.Base icon="plus" onClick={onClick} />;

  return (
    <System.IconButtonsGroup.Base>
      {tooltip ? <TippyTooltip {...tooltip}>{button}</TippyTooltip> : button}
    </System.IconButtonsGroup.Base>
  );
};

export default AddButton;
