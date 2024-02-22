import { OverflowTippyTooltip, swallowEvent } from '@voiceflow/ui';
import React from 'react';
import { RenderElementProps } from 'slate-react';

import { VariableTagTooltipStyles } from '@/components/VariableTag';
import { Designer } from '@/ducks';
import { useEntityEditModal, useVariableEditModal } from '@/hooks/modal.hook';
import { useSelector } from '@/hooks/store.hook';

import { StyledTag as Slot } from '../../TextEditor/plugins/variables/components/StyledTag';
import { usePluginOptions } from '../contexts';
import { PluginType } from '../editor';
import { VariableElement as VariableElementType } from '../editor/types';

interface VariableElementProps extends Omit<RenderElementProps, 'element'> {
  element: VariableElementType;
}

const VariableElement: React.FC<VariableElementProps> = ({ attributes, element, children }) => {
  const { id, isSlot } = element;

  const entity = useSelector(Designer.Entity.selectors.oneByID, { id: isSlot ? id : null });
  const variable = useSelector(Designer.Variable.selectors.oneByID, { id: isSlot ? null : id });
  const entityEditModal = useEntityEditModal();
  const variableEditModal = useVariableEditModal();

  const { withSlots } = usePluginOptions(PluginType.VARIABLES) ?? {};

  const varName = `{${isSlot ? entity?.name ?? id : variable?.name ?? id}}`;

  const onMouseDown = swallowEvent(() => {
    if (isSlot) {
      entityEditModal.openVoid({ entityID: id });
    } else {
      variableEditModal.openVoid({ variableID: id });
    }
  });

  return (
    <span contentEditable={false} {...attributes}>
      <OverflowTippyTooltip content={varName}>
        {(ref, { isOverflow }) => (
          <>
            {isOverflow && <VariableTagTooltipStyles />}

            <Slot ref={ref} color={isSlot ? entity?.color : variable?.color} isVariable={!withSlots || !isSlot} onMouseDown={onMouseDown}>
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
