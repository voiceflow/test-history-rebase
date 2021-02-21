import * as CSS from 'csstype';
import {
  border,
  borderRadius,
  BordersProps,
  boxShadow,
  BoxShadowProps,
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
  textShadow,
  TextShadowProps,
  typography,
  TypographyProps,
} from 'styled-system';

import { flexApartStyles, flexAroundStyles, flexCenterStyles, flexEndStyles, flexStartStyles, flexStyles } from '@/components/Flex';
import { css, styled } from '@/hocs';

export type BoxProps = ColorProps &
  LayoutProps &
  SpaceProps &
  PositionProps &
  FlexboxProps &
  TypographyProps &
  BordersProps &
  BoxShadowProps &
  TextShadowProps & {
    cursor?: CSS.Property.Cursor;
    noOverflow?: boolean;
  };

export const Box = styled.div<BoxProps>(
  space,
  color,
  layout,
  position,
  flexbox,
  typography,
  borderRadius,
  border,
  boxShadow,
  textShadow,
  css`
    cursor: ${(props: BoxProps) => props.cursor};

    ${(props: BoxProps) =>
      props.noOverflow &&
      css`
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      `}
  `
);

export const Flex = styled(Box)`
  ${flexStyles}
`;

export const FlexApart = styled(Box)`
  ${flexApartStyles}
`;

export const FlexAround = styled(Box)`
  ${flexAroundStyles}
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

export const FlexAlignStart = styled(Flex)`
  align-items: flex-start;
`;

export const FlexAlignEnd = styled(Flex)`
  align-items: flex-end;
`;

export default Box;
