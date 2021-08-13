import { slotStyles, variableStyle } from '@/components/VariableTag';
import { styled } from '@/hocs';

const Slot = styled.span<{ color?: string; isVariable?: boolean }>`
  pointer-events: none;

  pointer-events: all;
  ${({ isVariable }) => (isVariable ? variableStyle : slotStyles)}

  word-break: normal;
  border: none;
  line-height: 18px;
  box-shadow: ${({ isVariable }) => (isVariable ? 'inset 0 0 0 1px #dfe5ea' : 'none')};
  cursor: pointer;
`;

export default Slot;
