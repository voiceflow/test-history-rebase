import { css, styled } from '@/hocs/styled';
import { Theme } from '@/styles/theme';

interface DividerProps {
  theme: Theme;
  width?: number | string;
  height?: number | string;
  offset?: number;
  isVertical?: boolean;
}

export const getDividerStyles = ({
  isVertical,
  theme,
  width = isVertical ? 1 : '100%',
  height = isVertical ? '100%' : 1,
  offset = 16,
}: DividerProps) => css`
  width: ${typeof width === 'number' ? `${width}px` : width};
  height: ${typeof height === 'number' ? `${height}px` : height};
  margin: ${isVertical ? `0 ${offset}px` : `${offset}px 0`};
  background-color: ${theme.colors.borders};
`;

const Divider = styled.div`
  ${getDividerStyles}
`;

export default Divider;
