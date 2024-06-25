import { css, styled } from '@ui/styles';
import type * as CSS from 'csstype';
import type {
  BordersProps,
  BoxShadowProps,
  ColorProps,
  FlexboxProps,
  LayoutProps,
  PositionProps,
  SpaceProps,
  TextShadowProps,
  TypographyProps,
} from 'styled-system';
import {
  border,
  borderRadius,
  boxShadow,
  color,
  flexbox,
  layout,
  position,
  space,
  textShadow,
  typography,
} from 'styled-system';

import {
  flexApartStyles,
  flexAroundStyles,
  flexCenterStyles,
  flexColumnStyles,
  flexEndStyles,
  flexStartStyles,
  flexStyles,
} from '../Flex';

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
    fullWidth?: boolean;
  };

export const boxStyles = css<BoxProps>(
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
  css<BoxProps>`
    cursor: ${(props) => props.cursor};

    ${(props) =>
      props.noOverflow &&
      css`
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      `}

    ${(props) =>
      props.fullWidth &&
      css`
        width: 100%;
      `}
  `
);

export const Box = styled.div<BoxProps>`
  ${boxStyles}
`;

const Flex = styled(Box)`
  ${flexStyles}
`;

const FlexApart = styled(Box)`
  ${flexApartStyles}
`;

const FlexAround = styled(Box)`
  ${flexAroundStyles}
`;

const FlexCenter = styled(Box)`
  ${flexCenterStyles}
`;

const FlexEnd = styled(Box)`
  ${flexEndStyles}
`;

const FlexColumn = styled(Box)`
  ${flexColumnStyles}
`;

const FlexStart = styled(Box)`
  ${flexStartStyles}
`;

const FlexAlignStart = styled(Flex)`
  align-items: flex-start;
`;

const FlexAlignEnd = styled(Flex)`
  align-items: flex-end;
`;

export default Object.assign(Box, {
  Flex,
  FlexEnd,
  FlexApart,
  FlexStart,
  FlexAround,
  FlexCenter,
  FlexColumn,
  FlexAlignEnd,
  FlexAlignStart,
});
