import { css, styled, units } from '@/hocs';
import { Theme } from '@/styles/theme';

export interface SimpleDividerProps {
  theme: Theme;
  width?: number | string;
  height?: number | string;
  offset?: number;
  isVertical?: boolean;
  isSecondaryColor?: boolean;
}

export const getSimpleDividerStyles = ({
  isVertical,
  theme,
  width = isVertical ? 1 : '100%',
  height = isVertical ? '100%' : 1,
  offset = units(1.5)({ theme }),
  isSecondaryColor,
}: SimpleDividerProps) => css`
  width: ${typeof width === 'number' ? `${width}px` : width};
  height: ${typeof height === 'number' ? `${height}px` : height};
  margin: ${isVertical ? `0 ${offset}px` : `${offset}px 0`};
  background-color: ${isSecondaryColor ? theme.colors.separatorSecondary : theme.colors.separator};
`;

const SimpleDivider = styled.div`
  ${getSimpleDividerStyles}
`;

export default SimpleDivider;
