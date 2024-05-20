import { EditorButton, Tooltip, useTooltipModifiers } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';
import { TooltipContentLearn } from '@/components/Tooltip/TooltipContentLearn/TooltipContentLearn.component';
import { START_TRIGGER_LEARN_MORE } from '@/constants/link.constant';
import { popperPaddingModifierFactory } from '@/utils/popper.util';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

export const TriggersSectionStartItem: React.FC = () => {
  const tooltipModifiers = useTooltipModifiers([
    { name: 'offset', options: { offset: [0, 0] } },
    popperPaddingModifierFactory({ padding: 15 }),
  ]);

  return (
    <Tooltip
      width={176}
      inline
      placement="left-start"
      modifiers={tooltipModifiers}
      referenceElement={({ ref, popper, onOpen, onClose }) => (
        <CMSFormListItem
          ref={ref}
          width="100%"
          onRemove={() => null}
          onMouseEnter={onOpen}
          onMouseLeave={onClose}
          removeDisabled
        >
          <EditorButton prefixIconName="Start" label="Default start" disabled fullWidth />
          {popper}
        </CMSFormListItem>
      )}
    >
      {() => (
        <TooltipContentLearn
          label="This is the default starting trigger for the agent."
          onLearnClick={onOpenInternalURLInANewTabFactory(START_TRIGGER_LEARN_MORE)}
        />
      )}
    </Tooltip>
  );
};
