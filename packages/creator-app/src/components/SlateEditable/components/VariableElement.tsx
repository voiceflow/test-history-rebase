import { swallowEvent } from '@voiceflow/ui';
import React from 'react';
import { RenderElementProps } from 'slate-react';

import OverflowTippyTooltip from '@/components/OverflowTippyTooltip';
import { VariableTagTooltipStyles } from '@/components/VariableTag';
import { InteractionModelTabType } from '@/constants';
import * as Router from '@/ducks/router';
import * as SlotV2 from '@/ducks/slotV2';
import { useDispatch, useSelector } from '@/hooks';

import { usePluginOptions } from '../contexts';
import { PluginType } from '../editor';
import { VariableElement as VariableElementType } from '../editor/types';
import Slot from './Slot';

interface VariableElementProps extends Omit<RenderElementProps, 'element'> {
  element: VariableElementType;
}

const VariableElement: React.FC<VariableElementProps> = ({ attributes, element, children }) => {
  const getSlotByID = useSelector(SlotV2.getSlotByIDSelector);
  const goToInteractionModelEntity = useDispatch(Router.goToCurrentCanvasInteractionModelEntity);

  const { withSlots } = usePluginOptions(PluginType.VARIABLES) ?? {};

  const { id, name, isSlot } = element;
  const slot = isSlot ? getSlotByID(id) : null;
  const varName = `{${isSlot ? slot?.name ?? name : name}}`;

  return (
    <span contentEditable={false} {...attributes}>
      <OverflowTippyTooltip title={varName}>
        {(ref, { isOverflow }) => (
          <>
            {isOverflow && <VariableTagTooltipStyles />}

            <Slot
              ref={ref}
              color={isSlot ? slot?.color : undefined}
              isVariable={!withSlots || !isSlot}
              onMouseDown={swallowEvent(() =>
                goToInteractionModelEntity(isSlot ? InteractionModelTabType.SLOTS : InteractionModelTabType.VARIABLES, id)
              )}
            >
              {varName}
            </Slot>
          </>
        )}
      </OverflowTippyTooltip>

      {/* slate requires children to handler deletion correctly */}
      {children}
    </span>
  );
};

export default VariableElement;
