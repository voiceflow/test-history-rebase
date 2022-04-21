import { slotStyles, variableStyle } from '@/components/VariableTag';
import { styled } from '@/hocs';

const Slot = styled.span<{ color?: string; isVariable?: boolean }>`
  pointer-events: all;
  ${({ isVariable }) => (isVariable ? variableStyle : slotStyles)}

  line-height: 18px;
  word-break: normal;
  cursor: pointer;
  vertical-align: bottom;
`;

export default Slot;
