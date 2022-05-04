import { IconButton } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

interface RemoveIconProps {
  isHidden?: boolean;
}

const RemoveIcon = styled(IconButton).attrs({ icon: 'minus', size: 16, variant: IconButton.Variant.BASIC })<RemoveIconProps>`
  ${transition('opacity')}
  margin: 0px -10px 0px 8px;

  ${({ isHidden }) =>
    isHidden &&
    css`
      opacity: 0;
      pointer-events: none;
    `}
`;

export default RemoveIcon;
