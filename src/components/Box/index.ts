import {
  border,
  borderRadius,
  BordersProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system';

import { flexApartStyles, flexCenterStyles, flexEndStyles, flexStartStyles, flexStyles } from '@/components/Flex';
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

export const Box = styled.div<BoxProps>(space, color, layout, position, flexbox, typography, borderRadius, border);

export const Flex = styled(Box)`
  ${flexStyles}
`;

export const FlexApart = styled(Box)`
  ${flexApartStyles}
`;

export const FlexCenter = styled(Box)`
  ${flexCenterStyles}
`;

export const FlexEnd = styled(Box)`
  ${flexEndStyles}
`;

export const FlexStart = styled(Box)`
  ${flexStartStyles}
`;

export const ButtonBox = styled(Box)`
  cursor: ${({ cursor = 'default' }) => cursor};
`;

export default Box;
