import * as Realtime from '@voiceflow/realtime-sdk';
import { Animations } from '@voiceflow/ui';
import React from 'react';

import { BlockType, DragItem } from '@/constants';
import { useCanvasNodeFilter } from '@/hooks/canvas-node.hook';
import { useDragPreview } from '@/hooks/dnd.hook';
import { StepDragItem } from '@/pages/Canvas/components/CanvasDiagram';
import { getManager } from '@/pages/Canvas/managers/utils';

import { StepItem } from '../constants';
import * as S from './styles';
import SubMenuButton from './SubMenuButton';

interface SubMenuProps {
  steps: StepItem[];
  onDrop: VoidFunction;
}

const SubMenu: React.FC<SubMenuProps> = ({ steps, onDrop }) => {
  const [activeStepType, setActiveStepType] = React.useState<null | Realtime.BlockType>(null);

  const menuRef = React.useRef<HTMLDivElement>(null);

  const nodeFilter = useCanvasNodeFilter();
  const processedSteps = React.useMemo(
    () =>
      steps.filter(nodeFilter).map((step) => {
        const manager = getManager(step.type, true);

        return {
          ...step,
          icon: step.getIcon(manager),
          label: step.getLabel(manager),
          tooltipText: step.getStepTooltipText(manager),
          tooltipLink: step.getStepTooltipLink(manager),
        };
      }),
    [nodeFilter]
  );

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
    <S.SubMenuContainer ref={menuRef}>
      {processedSteps.map((step, index) => (
        <Animations.FadeDownDelayed key={step.label} delay={0.04 + index * 0.03}>
          <div onMouseEnter={() => onMouseEnterMenuButton(step.type)}>
            <SubMenuButton {...step} onDrop={onDrop} isFocused={activeStepType === step.type} />
          </div>
        </Animations.FadeDownDelayed>
      ))}
    </S.SubMenuContainer>
  );
};

export default SubMenu;
