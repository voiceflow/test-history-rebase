import { SquareButton, Tooltip, useTooltipModifiers } from '@voiceflow/ui-next';
import React from 'react';

import { TooltipContentHotKeys } from '@/components/Tooltip/TooltipContentHotKeys/TooltipContentHotKeys.component';

import { IDiagramLayoutHeaderAction } from './DiagramLayoutHeaderAction.interface';

export const DiagramLayoutHeaderAction: React.FC<IDiagramLayoutHeaderAction> = ({ onClick, tooltip, iconName, isActive }) => {
  const tooltipModifiers = useTooltipModifiers([{ name: 'offset', options: { offset: [0, 11] } }]);

  return (
    <Tooltip
      placement="bottom"
      modifiers={tooltipModifiers}
      referenceElement={({ ref, onOpen, onClose }) => (
        <SquareButton
          ref={ref}
          variant="dark"
          onClick={onClick}
          iconName={iconName}
          isActive={isActive}
          onMouseEnter={onOpen}
          onMouseLeave={onClose}
        />
      )}
    >
      {() => <TooltipContentHotKeys label={tooltip.label} hotkeys={tooltip.hotkeys} />}
    </Tooltip>
  );
};
