import {
  BordersProps,
  ColorProps,
  FlexboxProps,
  LayoutProps,
  PositionProps,
  SpaceProps,
  TypographyProps,
  borderRadius,
  color,
  flexbox,
  layout,
  position,
  space,
  typography,
} from 'styled-system';

import { flexApartStyles, flexStyles } from '@/components/Flex';
import { styled } from '@/hocs';

export type BoxProps = ColorProps &
  LayoutProps &
  SpaceProps &
  PositionProps &
  FlexboxProps &
  TypographyProps &
  BordersProps & {
    cursor?: string;
  };

export const Box = styled.div<BoxProps>(space, color, layout, position, flexbox, typography, borderRadius);

export const Flex = styled(Box)`
  ${flexStyles}
`;

export const FlexApart = styled(Box)`
  ${flexApartStyles}
`;

export const ButtonBox = styled(Box)`
  cursor: ${({ cursor = 'default' }) => cursor};
`;

export default Box;
