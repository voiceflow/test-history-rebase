import { SvgIcon } from '@voiceflow/ui';

import { css, styled, transition, units } from '@/hocs';

type RemoveIconProps = {
  isHidden?: boolean;
};

const RemoveIcon = styled(SvgIcon).attrs({ icon: 'remove' })<RemoveIconProps>`
  margin-left: ${units(2)}px;
  color: #6e849a;
  cursor: pointer;
  ${transition('color')}

  &:hover {
    color: #627990;
  }

  ${({ isHidden }) =>
    isHidden &&
    css`
      opacity: 0;
      pointer-events: none;
    `}
`;

export default RemoveIcon;
