import { mapProps } from 'recompose';

import SvgIcon from '@/components/SvgIcon';
import { css, styled, transition, units } from '@/hocs';

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
