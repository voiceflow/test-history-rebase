import { Portal, usePopper } from '@voiceflow/ui';
import React from 'react';

import { DragItem } from '@/constants';
import { useDragPreview } from '@/hooks';
import { getManager } from '@/pages/Canvas/managers/constants';

import { StepDragItem } from '../../../DesignMenu/components/Steps/types';
import { MenuStepItem } from '../../constants';
import { SubMenuButton, SubMenuContainer } from './components';

const SubMenu: React.FC<{ steps: MenuStepItem[] }> = ({ steps }) => {
  const rootPopper = usePopper({
    modifiers: [{ name: 'offset', options: { offset: [-65, 0] } }],
    placement: 'right-start',
  });

  const processedSteps = steps.map((step) => {
    const manager = getManager(step.type, true);
    return {
      ...step,
      icon: step.getStepMenuIcon(manager) ?? step.getIcon(manager),
      label: step.getLabel(manager),
      tooltipText: step.getStepTooltipText(manager),
      tooltipLink: step.getStepTooltipLink(manager),
    };
  });

  useDragPreview<StepDragItem>(DragItem.BLOCK_MENU, (props) => <SubMenuButton {...props} type={props.blockType} isDraggingPreview />, {
    horizontalEnabled: true,
  });

  return (
    <div ref={rootPopper.setReferenceElement}>
      <Portal portalNode={document.body}>
        <div ref={rootPopper.setPopperElement} style={rootPopper.styles.popper} {...rootPopper.attributes.popper}>
          <SubMenuContainer>
            {processedSteps.map((step) => (
              <SubMenuButton key={step.label} {...step} />
            ))}
          </SubMenuContainer>
        </div>
      </Portal>
    </div>
  );
};

export default SubMenu;
