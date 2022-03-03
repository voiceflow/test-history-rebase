import { IconButton } from '@voiceflow/ui';

import { css, styled, transition, units } from '@/hocs';

interface RemoveIconProps {
  isHidden?: boolean;
}

const RemoveIcon = styled(IconButton).attrs({ icon: 'minus' })<RemoveIconProps>`
  margin-left: ${units(1)}px;
  ${transition('background')}

  ${({ isHidden }) =>
    isHidden &&
    css`
      opacity: 0;
      pointer-events: none;
    `}
`;

export default RemoveIcon;
