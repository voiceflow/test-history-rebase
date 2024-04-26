import { styled, units } from '@ui/styles';

export interface DividerProps {
  inset?: boolean;
  offset?: number | [top: number, bottom: number];
  accent?: boolean;
}

const Divider = styled.hr<DividerProps>`
  width: ${({ inset, theme }) => (inset ? `calc(100% - ${units(4)({ theme })}px)` : '100%')};
  height: 1px;
  left: ${({ inset, theme }) => (inset ? units(4)({ theme }) : 0)}px;
  margin: ${({ offset }) =>
    (offset && (Array.isArray(offset) ? `${offset[0]}px 0 ${offset[1]}px 0` : `${offset}px 0`)) || '0'};
  background-color: ${({ theme, accent }) => (accent ? theme.colors.separator : theme.colors.separatorSecondary)};
  border-top: none !important;
  position: relative;
`;

export default Divider;
