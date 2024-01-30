import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { OverflowTippyTooltip, swallowEvent } from '@voiceflow/ui';
import React from 'react';
import { RenderElementProps } from 'slate-react';

import { VariableTagTooltipStyles } from '@/components/VariableTag';
import { InteractionModelTabType } from '@/constants';
import { Designer } from '@/ducks';
import * as Router from '@/ducks/router';
import { useFeature } from '@/hooks/feature';
import { useEntityEditModal, useVariableEditModal } from '@/hooks/modal.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { StyledTag as Slot } from '../../TextEditor/plugins/variables/components/StyledTag';
import { usePluginOptions } from '../contexts';
import { PluginType } from '../editor';
import { VariableElement as VariableElementType } from '../editor/types';

interface VariableElementProps extends Omit<RenderElementProps, 'element'> {
  element: VariableElementType;
}

const VariableElement: React.FC<VariableElementProps> = ({ attributes, element, children }) => {
  const { id, name, isSlot } = element;

  const entity = useSelector(Designer.Entity.selectors.oneByID, { id: isSlot ? id : null });
  const variable = useSelector(Designer.Variable.selectors.oneByID, { id: isSlot ? null : id });
  const cmsVariables = useFeature(FeatureFlag.CMS_VARIABLES);
  const entityEditModal = useEntityEditModal();
  const variableEditModal = useVariableEditModal();
  const goToNLUQuickViewEntity = useDispatch(Router.goToNLUQuickViewEntity);

  const { withSlots } = usePluginOptions(PluginType.VARIABLES) ?? {};

  // eslint-disable-next-line no-nested-ternary
  const varName = `{${isSlot ? entity?.name ?? id : cmsVariables.isEnabled ? variable?.name ?? id : name}}`;

  const onMouseDown = swallowEvent(() => {
    if (isSlot) {
      entityEditModal.openVoid({ entityID: id });
    } else if (cmsVariables.isEnabled) {
      variableEditModal.openVoid({ variableID: id });
    } else {
      goToNLUQuickViewEntity(InteractionModelTabType.VARIABLES, id);
    }
  });

  return (
    <span contentEditable={false} {...attributes}>
      <OverflowTippyTooltip content={varName}>
        {(ref, { isOverflow }) => (
          <>
            {isOverflow && <VariableTagTooltipStyles />}

            <Slot
              ref={ref}
              // eslint-disable-next-line no-nested-ternary
              color={isSlot ? entity?.color : cmsVariables.isEnabled ? variable?.color : undefined}
              isVariable={!withSlots || !isSlot}
              onMouseDown={onMouseDown}
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
