import { css, styled } from '@ui/styles';
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

import { flexApartStyles, flexAroundStyles, flexCenterStyles, flexColumnStyles, flexEndStyles, flexStartStyles, flexStyles } from '../Flex';

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

/**
 * @deprecated use Box.Flex instead
 */
export const BoxFlex = Flex;

/**
 * @deprecated use Box.FlexEnd instead
 */
export const BoxFlexEnd = FlexEnd;

/**
 * @deprecated use Box.FlexStart instead
 */
export const BoxFlexStart = FlexStart;
/**
 * @deprecated use Box.FlexApart instead
 */
export const BoxFlexApart = FlexApart;
/**
 * @deprecated use Box.FlexAround instead
 */
export const BoxFlexAround = FlexAround;
/**
 * @deprecated use Box.FlexCenter instead
 */
export const BoxFlexCenter = FlexCenter;
/**
 * @deprecated use Box.FlexAlignEnd instead
 */
export const BoxFlexAlignEnd = FlexAlignEnd;
/**
 * @deprecated use Box.FlexAlignStart instead
 */
export const BoxFlexAlignStart = FlexAlignStart;

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
