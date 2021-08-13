import { swallowEvent } from '@voiceflow/ui';
import React from 'react';
import { RenderElementProps } from 'slate-react';

import { InteractionModelTabType } from '@/constants';
import * as Router from '@/ducks/router';
import * as SlotDuck from '@/ducks/slot';
import { useDispatch, useSelector } from '@/hooks';

import { usePluginOptions } from '../contexts';
import { PluginType } from '../editor';
import { VariableElement as VariableElementType } from '../editor/types';
import Slot from './Slot';

interface VariableElementProps extends Omit<RenderElementProps, 'element'> {
  element: VariableElementType;
}

const VariableElement: React.FC<VariableElementProps> = ({ attributes, element, children }) => {
  const getSlotByID = useSelector(SlotDuck.slotByIDSelector);
  const goToInteractionModelEntity = useDispatch(Router.goToCurrentCanvasInteractionModelEntity);

  const { withSlots } = usePluginOptions(PluginType.VARIABLES) ?? {};

  const { id, name, isSlot } = element;
  const slot = isSlot ? getSlotByID(id) : null;

  return (
    <span contentEditable={false} {...attributes}>
      <Slot
        color={isSlot ? slot?.color : undefined}
        isVariable={!withSlots || !isSlot}
        onMouseDown={swallowEvent(() => goToInteractionModelEntity(isSlot ? InteractionModelTabType.SLOTS : InteractionModelTabType.VARIABLES, id))}
      >
        {`{${isSlot ? slot?.name ?? name : name}}`}
      </Slot>

      {/* slate requires children to handler deletion correctly */}
      {children}
    </span>
  );
};

export default VariableElement;
