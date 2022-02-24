import { IconVariant, SvgIcon, Toggle, ToggleSize } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '../../constants';
import { Container, ToggleAddContainer, ToggleArrowContainer } from './components';

interface CollapseTriggerProps {
  variant: SectionToggleVariant;
  onToggle?: React.MouseEventHandler | React.ChangeEventHandler<HTMLInputElement>;
  isCollapsed?: boolean;
  disabled?: boolean;
}

const CollapseTrigger: React.FC<CollapseTriggerProps> = ({ disabled, onToggle, isCollapsed, variant }) => (
  <Container disabled={disabled}>
    {variant === SectionToggleVariant.ARROW && (
      <ToggleArrowContainer onClick={onToggle as React.MouseEventHandler} isCollapsed={isCollapsed}>
        <SvgIcon variant={IconVariant.TERTIARY} icon="arrowLeft" size={12} />
      </ToggleArrowContainer>
    )}

    {variant === SectionToggleVariant.TOGGLE && (
      <Toggle checked={!isCollapsed} onChange={onToggle as React.ChangeEventHandler} size={ToggleSize.SMALL} />
    )}

    {variant === SectionToggleVariant.ADD && (
      <ToggleAddContainer>
        <SvgIcon
          onClick={onToggle as React.MouseEventHandler}
          variant={IconVariant.TERTIARY}
          icon={isCollapsed ? 'outlinedAdd' : 'outlinedMinus'}
          size={16}
        />
      </ToggleAddContainer>
    )}
  </Container>
);

export default CollapseTrigger;
