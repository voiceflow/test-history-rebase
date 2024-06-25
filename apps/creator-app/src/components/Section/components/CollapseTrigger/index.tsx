import { preventDefault, SvgIcon, System, Toggle } from '@voiceflow/ui';
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
        <SvgIcon icon="arrowToggle" size={10} />
      </ToggleArrowContainer>
    )}

    {variant === SectionToggleVariant.TOGGLE && (
      <Toggle checked={!isCollapsed} onChange={onToggle as React.ChangeEventHandler} size={Toggle.Size.SMALL} />
    )}

    {variant === SectionToggleVariant.ADD && (
      <ToggleAddContainer>
        <SvgIcon
          onClick={onToggle as React.MouseEventHandler}
          variant={SvgIcon.Variant.TERTIARY}
          icon={isCollapsed ? 'outlinedAdd' : 'outlinedMinus'}
          size={16}
        />
      </ToggleAddContainer>
    )}

    {variant === SectionToggleVariant.ADD_V2 && (
      <ToggleAddContainer>
        <System.IconButtonsGroup.Base>
          <System.IconButton.Base
            icon={isCollapsed ? 'plus' : 'minus'}
            onClick={preventDefault(onToggle as React.MouseEventHandler)}
          />
        </System.IconButtonsGroup.Base>
      </ToggleAddContainer>
    )}
  </Container>
);

export default CollapseTrigger;
