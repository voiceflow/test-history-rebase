import { IconButton as BaseIconButton, IconButtonVariant, SvgIconTypes } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

interface IconButtonProps {
  icon: SvgIconTypes.Icon;
  active: boolean;
  onMouseDown: React.MouseEventHandler<HTMLButtonElement>;
}

const activeStyles = css`
  color: #132144;
  background: #eef4f6;
  border: none;
  box-shadow: none !important;
`;

const IconButton = styled(BaseIconButton).attrs({ variant: IconButtonVariant.BASIC, size: 16 })<IconButtonProps>`
  ${transition('background', 'color')}
  border-radius: 5px;
  margin: -1px 3px;

  ${({ active }) => active && activeStyles}

  &:active {
    ${activeStyles}
  }
`;

export default IconButton;
