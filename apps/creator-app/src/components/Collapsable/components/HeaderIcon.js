import { SvgIcon } from '@voiceflow/ui';
import { mapProps } from 'recompose';

import { css, styled, transition, units } from '@/hocs/styled';

const HeaderIcon = styled(mapProps(({ rotate, ...props }) => props)(SvgIcon))`
  margin-right: ${({ rightIcon }) => !rightIcon && units()}px;
  transform: rotate(-90deg);
  ${transition('transform')}
  ${({ rotate }) =>
    rotate &&
    css`
      transform: rotate(0deg);
    `}
`;

export default HeaderIcon;
