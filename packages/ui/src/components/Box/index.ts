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

import { css, styled } from '../../styles';
import { flexApartStyles, flexAroundStyles, flexCenterStyles, flexEndStyles, flexStartStyles, flexStyles } from '../Flex';

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

const Box = styled.div<BoxProps>(
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

export default Box;

export const BoxFlex = styled(Box)`
  ${flexStyles}
`;

export const BoxFlexApart = styled(Box)`
  ${flexApartStyles}
`;

export const BoxFlexAround = styled(Box)`
  ${flexAroundStyles}
`;

export const BoxFlexCenter = styled(Box)`
  ${flexCenterStyles}
`;

export const BoxFlexEnd = styled(Box)`
  ${flexEndStyles}
`;

export const BoxFlexStart = styled(Box)`
  ${flexStartStyles}
`;

export const BoxFlexAlignStart = styled(BoxFlex)`
  align-items: flex-start;
`;

export const BoxFlexAlignEnd = styled(BoxFlex)`
  align-items: flex-end;
`;
