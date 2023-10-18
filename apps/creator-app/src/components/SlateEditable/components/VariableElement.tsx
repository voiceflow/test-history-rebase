import { OverflowTippyTooltip, swallowEvent } from '@voiceflow/ui';
import React from 'react';
import { RenderElementProps } from 'slate-react';

import { VariableTagTooltipStyles } from '@/components/VariableTag';
import { InteractionModelTabType } from '@/constants';
import * as Router from '@/ducks/router';
import { useOneEntityByIDSelector, useOnOpenEntityEditModal } from '@/hooks/entity.hook';
import { useDispatch } from '@/hooks/realtime';

import { StyledTag as Slot } from '../../TextEditor/plugins/variables/components/StyledTag';
import { usePluginOptions } from '../contexts';
import { PluginType } from '../editor';
import { VariableElement as VariableElementType } from '../editor/types';

interface VariableElementProps extends Omit<RenderElementProps, 'element'> {
  element: VariableElementType;
}

const VariableElement: React.FC<VariableElementProps> = ({ attributes, element, children }) => {
  const { id, name, isSlot } = element;
  const slot = useOneEntityByIDSelector({ id: isSlot ? id : null });
  const onOpenEntityEditModal = useOnOpenEntityEditModal();
  const goToNLUQuickViewEntity = useDispatch(Router.goToNLUQuickViewEntity);

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
                isSlot ? onOpenEntityEditModal({ entityID: id }) : goToNLUQuickViewEntity(InteractionModelTabType.VARIABLES, id)
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
