import * as Realtime from '@voiceflow/realtime-sdk';
import { Animations, Portal, usePopper } from '@voiceflow/ui';
import React from 'react';

import { BlockType, DragItem } from '@/constants';
import { useDragPreview, useFeature } from '@/hooks';
import { getManager } from '@/pages/Canvas/managers/utils';

import { StepDragItem } from '../../../DesignMenu/components/Steps/types';
import { MenuStepItem } from '../../constants';
import { SubMenuButton, SubMenuContainer } from './components';

interface SubMenuProps {
  steps: MenuStepItem[];
  onDrop: VoidFunction;
}

const SubMenu: React.FC<SubMenuProps> = ({ steps, onDrop }) => {
  const newEditors2 = useFeature(Realtime.FeatureFlag.NEW_EDITORS_PART_2);
  const chatCardStep = useFeature(Realtime.FeatureFlag.CHAT_CARD_STEP);

  const menuRef = React.useRef<HTMLDivElement>(null);

  const rootPopper = usePopper({
    modifiers: [{ name: 'offset', options: { offset: [-72, 0] } }],
    placement: 'right-start',
  });

  const processedSteps = steps
    .filter((step) => {
      if (!newEditors2.isEnabled && step.type === BlockType.RANDOMV2) return false;
      if (newEditors2.isEnabled && step.type === BlockType.RANDOM) return false;
      if (!chatCardStep.isEnabled && step.type === BlockType.CARDV2) return false;

      return true;
    })
    .map((step) => {
      const manager = getManager(step.type, true);

      return {
        ...step,
        icon: step.getIcon(manager),
        label: step.getLabel(manager),
        tooltipText: step.getStepTooltipText(manager),
        tooltipLink: step.getStepTooltipLink(manager),
      };
    });

  useDragPreview<StepDragItem>(
    DragItem.BLOCK_MENU,
    (props) => (
      <div style={{ width: `${(menuRef.current?.clientWidth ?? 154) - 12}px` }}>
        <SubMenuButton {...props} type={props.blockType} onDrop={onDrop} isDraggingPreview />
      </div>
    ),
    { horizontalEnabled: true }
  );

  return (
    <div ref={rootPopper.setReferenceElement}>
      <Portal portalNode={document.body}>
        <div ref={rootPopper.setPopperElement} style={rootPopper.styles.popper} {...rootPopper.attributes.popper}>
          <SubMenuContainer ref={menuRef}>
            {processedSteps.map((step, index) => (
              <Animations.FadeDownDelayedContainer key={step.label} delay={0.04 + index * 0.03}>
                <SubMenuButton {...step} onDrop={onDrop} />
              </Animations.FadeDownDelayedContainer>
            ))}
          </SubMenuContainer>
        </div>
      </Portal>
    </div>
  );
};

export default SubMenu;
