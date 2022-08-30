import { SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import { useHover } from '@/hooks';
import { TopLibraryItem, TopStepItem } from '@/pages/Project/components/StepMenu/constants';
import { ClassName } from '@/styles/constants';

import * as S from '../styles';
import SubMenu from './SubMenu';

interface MenuButtonItem {
  step: TopStepItem | TopLibraryItem;
}

const MenuButton: React.FC<MenuButtonItem> = ({ step }) => {
  const [isHovered, , hoverHandlers] = useHover();

  return (
    <div {...hoverHandlers} className={ClassName.STEP_MENU_ITEM}>
      <S.MenuButtonContainer focused={isHovered}>
        <SvgIcon icon={step.smallIcon ? step.smallIcon : step.icon} size={step.label === 'Logic' ? 18 : 16} />

        <Text>{step.label}</Text>

        <S.ArrowSvgContainer icon="arrowRight" width={6} height={10} />
      </S.MenuButtonContainer>

      {step.steps && isHovered && (step.isLibrary ? <SubMenu templates={step.steps} /> : <SubMenu steps={step.steps} />)}
    </div>
  );
};

export default MenuButton;
