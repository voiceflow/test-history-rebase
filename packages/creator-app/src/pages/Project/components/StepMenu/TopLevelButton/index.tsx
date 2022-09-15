import { Animations, Portal, SvgIcon, Text, usePopper } from '@voiceflow/ui';
import React from 'react';

import { useHover } from '@/hooks';
import { ClassName } from '@/styles/constants';

import { TopLibraryItem, TopStepItem } from '../constants';
import LibrarySubMenu from '../LibrarySubMenu';
import SubMenu from '../SubMenu';
import * as S from './styles';

interface TopLevelButtonItem {
  step: TopStepItem | TopLibraryItem;
  animationIndex: number;
}

const TopLevelButton: React.FC<TopLevelButtonItem> = ({ step, animationIndex }) => {
  const [isHovered, , hoverHandlers, setHovering] = useHover();

  const rootPopper = usePopper({
    placement: 'right-start',
  });

  return (
    <div {...hoverHandlers} className={ClassName.STEP_MENU_ITEM}>
      <Animations.FadeLeftContainer distance={-10} delay={animationIndex * 0.06} duration={0.1}>
        <S.ButtonContainer focused={isHovered} ref={rootPopper.setReferenceElement}>
          <SvgIcon icon={step.icon} size={step.label === 'Logic' ? 24 : 22} />

          <Text paddingTop="3px" fontSize="11px" fontWeight={600}>
            {step.label}
          </Text>
        </S.ButtonContainer>
      </Animations.FadeLeftContainer>

      {step.steps && isHovered && (
        <Portal portalNode={document.body}>
          <div
            ref={rootPopper.setPopperElement}
            style={rootPopper.styles.popper}
            {...rootPopper.attributes.popper}
            className={ClassName.SUB_STEP_MENU}
          >
            {step.isLibrary ? (
              <LibrarySubMenu templates={step.steps} onDrop={() => setHovering(false)} />
            ) : (
              <SubMenu steps={step.steps} onDrop={() => setHovering(false)} />
            )}
          </div>
        </Portal>
      )}
    </div>
  );
};

export default TopLevelButton;
