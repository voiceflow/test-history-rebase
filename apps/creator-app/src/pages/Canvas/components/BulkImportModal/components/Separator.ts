import { styled, units } from '@/hocs/styled';

interface SeparatorProps {
  isLast?: boolean;
}

const Separator = styled.div<SeparatorProps>`
  position: relative;
  right: -${units(4)}px;
  width: calc(100% + ${units(4)}px);
  height: 1px;
  margin-top: ${units(2)}px;
  margin-left: -${units(4)}px;
  margin-bottom: ${({ isLast }) => (isLast ? 0 : units(2))}px;
  background-color: #eaeff4;
`;

export default Separator;
