import { FormControlLabel, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { TooltipContentLearn } from '@/components/Tooltip/TooltipContentLearn/TooltipContentLearn.component';
import { usePopperModifiers } from '@/hooks/popper.hook';
import { popperPaddingModifierFactory } from '@/utils/popper.util';

import { IRadioGroupLabelWithTooltip } from './RadioGroupLabelWithTooltip.interface';

export const RadioGroupLabelWithTooltip: React.FC<IRadioGroupLabelWithTooltip> = ({
  label,
  width = 192,
  children,
  placement = 'left-start',
  onLearnClick,
  offsetModifier = [-28, 0],
  paddingModifier = 43,
}) => {
  const titleModifiers = usePopperModifiers([
    { name: 'offset', options: { offset: offsetModifier } },
    popperPaddingModifierFactory({ padding: paddingModifier }),
  ]);

  return (
    <Tooltip
      width={width}
      inline
      placement={placement}
      modifiers={titleModifiers}
      referenceElement={({ ref, onOpen, onClose, popper }) => (
        <span ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose}>
          {popper}
          <FormControlLabel.Label label={label} />
        </span>
      )}
    >
      {() => <TooltipContentLearn label={children} onLearnClick={onLearnClick} />}
    </Tooltip>
  );
};
