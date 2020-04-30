import {
  ColorProps,
  FlexboxProps,
  LayoutProps,
  PositionProps,
  SpaceProps,
  TypographyProps,
  color,
  flexbox,
  layout,
  position,
  space,
  typography,
} from 'styled-system';

import { flexStyles } from '@/components/Flex';
import { styled } from '@/hocs';

export type BoxProps = ColorProps & LayoutProps & SpaceProps & PositionProps & FlexboxProps & TypographyProps;

export const Box = styled.div<BoxProps>(space, color, layout, position, flexbox, typography);

export const Flex = styled(Box)`
  ${flexStyles}
`;

export default Box;
