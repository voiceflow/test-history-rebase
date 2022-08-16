import { BaseModels } from '@voiceflow/base-types';
import { Animations, Portal, usePopper } from '@voiceflow/ui';
import React from 'react';

import { DragItem } from '@/constants';
import { useDragPreview } from '@/hooks';

import { LibraryDragItem } from '../../constants';
import * as S from '../SubMenu/styles';
import LibrarySubMenuButton from './components/LibrarySubMenuButton';

interface LibrarySubMenuProps {
  steps: BaseModels.Version.CanvasTemplate[];
  onDrop: VoidFunction;
}

const LibrarySubMenu: React.FC<LibrarySubMenuProps> = ({ steps, onDrop }) => {
  const menuRef = React.useRef<HTMLDivElement>(null);

  const rootPopper = usePopper({
    modifiers: [{ name: 'offset', options: { offset: [-72, 0] } }],
    placement: 'right-start',
  });

  const processedSteps = steps.sort((a, b) => {
    if (a.name > b.name) return 1;
    if (b.name > a.name) return -1;
    return 0;
  });

  useDragPreview<LibraryDragItem>(
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
          <S.SubMenuContainer ref={menuRef}>
            {processedSteps.map((step, index) => (
              <Animations.FadeDownDelayedContainer key={step.name} delay={0.04 + index * 0.03}>
                <LibrarySubMenuButton {...step} onDrop={onDrop} />
              </Animations.FadeDownDelayedContainer>
            ))}
          </S.SubMenuContainer>
        </div>
      </Portal>
    </div>
  );
};

export default LibrarySubMenu;
