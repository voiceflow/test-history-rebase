import { IconButton as BaseIconButton, IconButtonFlatContainerProps, IconButtonProps as BaseIconButtonProps, IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { css, styled, transition } from '@/hocs/styled';

const activeStyles = css`
  color: #132144 !important;
  border: none;
  background: none !important;
  box-shadow: none !important;
  opacity: 1;
`;

const StyledIconButton = styled(BaseIconButton)<IconButtonFlatContainerProps>`
  ${transition('background', 'color', 'opacity')}

  width: 32px;
  height: 32px;
  color: #6e849a;
  opacity: 0.8;
  border-radius: 0;
  box-shadow: none !important;

  &:hover {
    opacity: 1;
    color: #6e849a;
  }

  ${({ active }) => active && activeStyles}

  &:active {
    ${activeStyles}
  }
`;

const IconButton: React.ForwardRefRenderFunction<HTMLButtonElement, BaseIconButtonProps> = (props, ref) => (
  <StyledIconButton ref={ref} {...props} variant={IconButtonVariant.FLAT} size={16} />
);

export default React.forwardRef(IconButton);
