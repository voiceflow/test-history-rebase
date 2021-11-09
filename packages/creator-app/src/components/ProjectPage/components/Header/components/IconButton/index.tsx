import { Nullable } from '@voiceflow/common';
import { SvgIcon, TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

import { Button, ButtonProps, Container, ExpandIconContainer } from './components';

export interface IconButtonProps extends Omit<ButtonProps, 'size' | 'variant' | 'preventFocusStyle'> {
  size?: number;
  tooltip?: Nullable<TippyTooltipProps>;
  expandable?: boolean;
  expandActive?: boolean;
  expandTooltip?: Nullable<TippyTooltipProps>;
  onExpandClick?: React.MouseEventHandler;
}

const IconButton: React.ForwardRefRenderFunction<HTMLDivElement, IconButtonProps> = (
  { size, tooltip, isSmall, className, expandable, expandActive, expandTooltip, onExpandClick, ...props },
  ref
) => {
  const ButtonContainer = tooltip ? TippyTooltip : React.Fragment;
  const ExpandedContainer = expandTooltip ? TippyTooltip : React.Fragment;

  return (
    <Container ref={ref} className={className}>
      <ButtonContainer {...tooltip}>
        <Button size={size ?? (isSmall ? 16 : 20)} isSmall={isSmall} {...props} />
      </ButtonContainer>

      {expandable && (
        <ExpandedContainer {...expandTooltip}>
          <ExpandIconContainer onClick={onExpandClick} isActive={expandActive}>
            <SvgIcon icon="expand" size={7} color="#6e849a" />
          </ExpandIconContainer>
        </ExpandedContainer>
      )}
    </Container>
  );
};

export default React.forwardRef<HTMLDivElement, IconButtonProps>(IconButton);
