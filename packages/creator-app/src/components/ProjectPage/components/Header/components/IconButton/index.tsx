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
  return (
    <Container ref={ref} className={className}>
      <TippyTooltip disabled={!tooltip} {...tooltip}>
        <Button size={size ?? (isSmall ? 16 : 20)} isSmall={isSmall} {...props} />
      </TippyTooltip>

      {expandable && (
        <TippyTooltip disabled={!expandTooltip} {...expandTooltip}>
          <ExpandIconContainer onClick={onExpandClick} isActive={expandActive}>
            <SvgIcon icon="expand" size={7} color="#6e849a" />
          </ExpandIconContainer>
        </TippyTooltip>
      )}
    </Container>
  );
};

export default React.forwardRef<HTMLDivElement, IconButtonProps>(IconButton);
