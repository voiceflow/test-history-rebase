import { colors, styled, ThemeColor } from '@/styles';

import type { TextProps } from './Text';
import Text from './Text';

export const Label = styled(Text).attrs<TextProps>(({ fontSize = 15 }) => ({ as: 'label', fontSize }))`
  display: block;
  margin-bottom: 11px;
  color: ${({ color }) => color ?? colors(ThemeColor.SECONDARY)};
  font-weight: 600;
  line-height: 1.4666666667;
`;

export default Label;
