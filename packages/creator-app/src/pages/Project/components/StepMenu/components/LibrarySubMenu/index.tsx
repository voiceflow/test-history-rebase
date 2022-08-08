import { Animations, Portal, usePopper } from '@voiceflow/ui';
import React from 'react';

import { DragItem } from '@/constants';
import { useDragPreview } from '@/hooks';

import { StepDragItem } from '../../../DesignMenu/components/Steps/types';
import { LibraryItem } from '../../constants';
import { SubMenuContainer } from '../SubMenu/styles';
import LibrarySubMenuButton from './components/LibrarySubMenuButton';

interface LibrarySubMenuProps {
  steps: LibraryItem[];
  onDrop: VoidFunction;
}

const LibrarySubMenu: React.FC<LibrarySubMenuProps> = ({ steps, onDrop }) => {
  const menuRef = React.useRef<HTMLDivElement>(null);

  const rootPopper = usePopper({
    modifiers: [{ name: 'offset', options: { offset: [-72, 0] } }],
    placement: 'right-start',
  });

  const processedSteps = steps
    .map((step) => {
      return {
        ...step,
        label: step.label,
      };
    })
    .sort((a, b) => {
      if (a.label > b.label) return 1;
      if (b.label > a.label) return -1;
      return 0;
    });

  useDragPreview<StepDragItem>(
    DragItem.TEMPLATES,
    (props) => (
      <div style={{ width: `${(menuRef.current?.clientWidth ?? 154) - 12}px` }}>
        <LibrarySubMenuButton {...props} onDrop={onDrop} isDraggingPreview />
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
                <LibrarySubMenuButton {...step} onDrop={onDrop} />
              </Animations.FadeDownDelayedContainer>
            ))}
          </SubMenuContainer>
        </div>
      </Portal>
    </div>
  );
};

export default LibrarySubMenu;
