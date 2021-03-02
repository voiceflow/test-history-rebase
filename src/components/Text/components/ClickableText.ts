import { styled, transition } from '@/hocs';

import { TextProps } from '../types';
import Text from './Text';

export const ClickableText = styled(Text)<TextProps>`
  ${transition('color')}
  display: inline-block;
  color: ${({ theme }) => theme.colors.blue};
  cursor: pointer;
  user-select: none;

  :hover {
    color: ${({ theme }) => theme.colors.darkBlue};
  }
`;

export default ClickableText;
