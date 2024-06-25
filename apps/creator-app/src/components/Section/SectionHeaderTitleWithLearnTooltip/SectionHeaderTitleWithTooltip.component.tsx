import { Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { TooltipContentLearn } from '@/components/Tooltip/TooltipContentLearn/TooltipContentLearn.component';
import { usePopperModifiers } from '@/hooks/popper.hook';
import { popperPaddingModifierFactory } from '@/utils/popper.util';

import type { ISectionHeaderTitleWithLearnTooltip } from './SectionHeaderTitleWithLearnTooltip.interface';

export const SectionHeaderTitleWithLearnTooltip: React.FC<ISectionHeaderTitleWithLearnTooltip> = ({
  title,
  width = 192,
  children,
  className,
  placement = 'left-start',
  onLearnClick,
  offsetModifier = [-12, 0],
  paddingModifier = 27,
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
          {typeof title !== 'object' ? <Text className={className}>{title}</Text> : title}
        </span>
      )}
    >
      {() => <TooltipContentLearn label={children} onLearnClick={onLearnClick} />}
    </Tooltip>
  );
};
