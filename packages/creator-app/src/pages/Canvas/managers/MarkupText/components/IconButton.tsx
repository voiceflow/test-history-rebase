import { IconButton as BaseIconButton, IconButtonProps as BaseIconButtonProps, IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { css, styled, transition } from '@/hocs';

interface IconButtonProps {
  active: boolean;
  onMouseDown: React.MouseEventHandler<HTMLButtonElement>;
}

const activeStyles = css`
  color: #132144;
  background: #eef4f6;
  border: none;
  box-shadow: none !important;
`;

const StyledIconButton = styled(BaseIconButton)<IconButtonProps>`
  ${transition('background', 'color')};
  border-radius: 5px;
  margin: -1px 3px;

  ${({ active }) => active && activeStyles}

  &:active {
    ${activeStyles}
  }
`;

const IconButton: React.ForwardRefRenderFunction<HTMLButtonElement, BaseIconButtonProps & IconButtonProps> = (props, ref) => (
  <StyledIconButton ref={ref} {...props} variant={IconButtonVariant.BASIC} size={16} />
);

export default React.forwardRef(IconButton);
