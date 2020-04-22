import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import Toggle from '@/components/Toggle';
import { IconVariant } from '@/constants';

import { SectionToggleVariant } from '../../constants';
import { ToggleArrowContainer, ToggleSwitchContainer } from './components';

type CollapseTriggerProps = {
  variant: SectionToggleVariant;
  onToggle?: React.MouseEventHandler;
  isCollapsed?: boolean;
};

const CollapseTrigger: React.FC<CollapseTriggerProps> = ({ onToggle, isCollapsed, variant }) => {
  return (
    <div>
      {variant === SectionToggleVariant.ARROW && (
        <ToggleArrowContainer onClick={onToggle} isCollapsed={isCollapsed}>
          <SvgIcon variant={IconVariant.TERTIARY} icon="arrowLeft" size={12} />
        </ToggleArrowContainer>
      )}

      {variant === SectionToggleVariant.TOGGLE && (
        <ToggleSwitchContainer>
          <Toggle checked={!isCollapsed} onChange={onToggle} />
        </ToggleSwitchContainer>
      )}
    </div>
  );
};

export default CollapseTrigger;
