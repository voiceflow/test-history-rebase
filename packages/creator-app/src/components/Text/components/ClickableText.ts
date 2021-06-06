import { css, styled, transition } from '@/hocs';
import { changeColorShade } from '@/utils/colors';

import { TextProps } from '../types';
import Text from './Text';

export const ClickableText = styled(Text)<TextProps & { isActive?: boolean; disabled?: boolean }>`
  ${transition('color')}
  display: inline-block;
  color: ${({ color, theme }) => color ?? theme.colors.blue};
  cursor: pointer;
  user-select: none;

  ${({ isActive }) =>
    isActive &&
    css`
      text-decoration: underline;
    `}

  :hover {
    color: ${({ color, theme }) => (color ? changeColorShade(color, -20) : theme.colors.darkBlue)};
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}
`;

export default ClickableText;
