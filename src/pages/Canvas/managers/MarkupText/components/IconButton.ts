import BaseIconButton, { IconButtonVariant } from '@/components/IconButton';
import { css, styled, transition } from '@/hocs';

const activeStyles = css`
  color: #132144;
  background: #eef4f6;
  border: none;
  box-shadow: none !important;
`;

const IconButton = styled(BaseIconButton).attrs({ variant: IconButtonVariant.FLAT, size: 16 })`
  ${transition('background', 'color')}
  border-radius: 5px;

  ${({ active }) => active && activeStyles}

  &:active {
    ${activeStyles}
  }
`;

export default IconButton;
