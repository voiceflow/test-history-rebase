import { OverflowTippyTooltip, swallowEvent } from '@voiceflow/ui';
import React from 'react';
import { RenderElementProps } from 'slate-react';

import { VariableTagTooltipStyles } from '@/components/VariableTag';
import { InteractionModelTabType } from '@/constants';
import * as Router from '@/ducks/router';
import * as SlotV2 from '@/ducks/slotV2';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { useModal } from '@/ModalsV2/hooks';
import Edit from '@/ModalsV2/modals/NLU/Entity/Edit';

import { StyledTag as Slot } from '../../TextEditor/plugins/variables/components/StyledTag';
import { usePluginOptions } from '../contexts';
import { PluginType } from '../editor';
import { VariableElement as VariableElementType } from '../editor/types';

interface VariableElementProps extends Omit<RenderElementProps, 'element'> {
  element: VariableElementType;
}

const VariableElement: React.FC<VariableElementProps> = ({ attributes, element, children }) => {
  const { id, name, isSlot } = element;
  const slot = useSelector(SlotV2.slotByIDSelector, { id: isSlot ? id : null });
  const entityEditModal = useModal(Edit);
  const goToInteractionModelEntity = useDispatch(Router.goToCurrentCanvasInteractionModelEntity);

  const { withSlots } = usePluginOptions(PluginType.VARIABLES) ?? {};

  const varName = `{${isSlot ? slot?.name ?? name : name}}`;

  return (
    <span contentEditable={false} {...attributes}>
      <OverflowTippyTooltip content={varName}>
        {(ref, { isOverflow }) => (
          <>
            {isOverflow && <VariableTagTooltipStyles />}

            <Slot
              ref={ref}
              color={isSlot ? slot?.color : undefined}
              isVariable={!withSlots || !isSlot}
              onMouseDown={swallowEvent(() =>
                isSlot ? entityEditModal.openVoid({ slotID: id }) : goToInteractionModelEntity(InteractionModelTabType.VARIABLES, id)
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
