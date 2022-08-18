import { Animations, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import { useHover } from '@/hooks';
import { ClassName } from '@/styles/constants';

import { TopLibraryItem, TopStepItem } from '../../constants';
import LibrarySubMenu from '../LibrarySubMenu';
import SubMenu from '../SubMenu';
import { TopLevelButtonContainer } from './TopLevelButtonContainer';

interface TopLevelButtonItem {
  step: TopStepItem | TopLibraryItem;
  animationIndex: number;
}

const TopLevelButton: React.FC<TopLevelButtonItem> = ({ step, animationIndex }) => {
  const [isHovered, , hoverHandlers, setHovering] = useHover();

  return (
    <div {...hoverHandlers} className={ClassName.STEP_MENU_ITEM}>
      <Animations.FadeLeftContainer distance={-10} delay={animationIndex * 0.06} duration={0.1}>
        <TopLevelButtonContainer focused={isHovered}>
          <SvgIcon icon={step.icon} size={step.label === 'Logic' ? 24 : 22} />

          <Text paddingTop="3px" fontSize="11px" fontWeight={600}>
            {step.label}
          </Text>
        </TopLevelButtonContainer>
      </Animations.FadeLeftContainer>

      {step.steps &&
        isHovered &&
        (step.isLibrary ? (
          <LibrarySubMenu templates={step.steps} onDrop={() => setHovering(false)} />
        ) : (
          <SubMenu steps={step.steps} onDrop={() => setHovering(false)} />
        ))}
    </div>
  );
};

export default TopLevelButton;
