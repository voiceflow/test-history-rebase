import * as Realtime from '@voiceflow/realtime-sdk';
import { Animations, Portal, usePopper } from '@voiceflow/ui';
import React from 'react';

import { BlockType, DragItem } from '@/constants';
import { useDragPreview, useFeature } from '@/hooks';
import { StepDragItem } from '@/pages/Canvas/components/CanvasDiagram';
import { getManager } from '@/pages/Canvas/managers/utils';

import { StepItem } from '../../constants';
import { SubMenuButton } from './components';
import * as S from './styles';

interface SubMenuProps {
  steps: StepItem[];
  onDrop: VoidFunction;
}

const SubMenu: React.FC<SubMenuProps> = ({ steps, onDrop }) => {
  const chatCardStep = useFeature(Realtime.FeatureFlag.CHAT_CARD_STEP);
  const [activeStepType, setActiveStepType] = React.useState<null | Realtime.BlockType>(null);

  const menuRef = React.useRef<HTMLDivElement>(null);

  const rootPopper = usePopper({
    modifiers: [{ name: 'offset', options: { offset: [-72, 0] } }],
    placement: 'right-start',
  });

  const processedSteps = steps
    .filter((step) => {
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

  const onMouseEnterMenuButton = (stepType: BlockType) => {
    // this will close the context menu when moving the focus to another step
    if (stepType !== activeStepType) setActiveStepType(stepType);
  };

  return (
    <div ref={rootPopper.setReferenceElement}>
      <Portal portalNode={document.body}>
        <div ref={rootPopper.setPopperElement} style={rootPopper.styles.popper} {...rootPopper.attributes.popper}>
          <S.SubMenuContainer ref={menuRef}>
            {processedSteps.map((step, index) => (
              <Animations.FadeDownDelayedContainer key={step.label} delay={0.04 + index * 0.03}>
                <div onMouseEnter={() => onMouseEnterMenuButton(step.type)}>
                  <SubMenuButton {...step} onDrop={onDrop} isFocused={activeStepType === step.type} />
                </div>
              </Animations.FadeDownDelayedContainer>
            ))}
          </S.SubMenuContainer>
        </div>
      </Portal>
    </div>
  );
};

export default SubMenu;
