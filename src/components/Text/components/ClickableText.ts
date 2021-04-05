import { styled, transition } from '@/hocs';
import { changeColorShade } from '@/utils/colors';

import { TextProps } from '../types';
import Text from './Text';

export const ClickableText = styled(Text)<TextProps>`
  ${transition('color')}
  display: inline-block;
  color: ${({ color, theme }) => color ?? theme.colors.blue};
  cursor: pointer;
  user-select: none;

  :hover {
    color: ${({ color, theme }) => (color ? changeColorShade(color, -20) : theme.colors.darkBlue)};
  }
`;

export default ClickableText;
