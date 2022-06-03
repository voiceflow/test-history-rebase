import { IconButton as BaseIconButton, IconButtonBaseContainerProps, IconButtonVariant } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

const activeStyles = css`
  color: #132144;
  background: #eef4f6;
  border: none;
  box-shadow: none !important;
`;

const IconButton = styled(BaseIconButton).attrs({ variant: IconButtonVariant.BASIC, size: 16 })<IconButtonBaseContainerProps>`
  ${transition('background', 'color')}
  border-radius: 5px;
  margin: -1px 3px;

  &:active {
    ${activeStyles}
  }
`;

export default IconButton;
