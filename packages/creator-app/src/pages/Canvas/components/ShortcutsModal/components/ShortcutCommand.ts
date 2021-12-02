import { variableStyle } from '@/components/VariableTag';
import { styled } from '@/hocs';

const ShortcutCommand = styled.span`
  ${variableStyle}
  display: inline-flex;
  height: 24px;
  min-width: 24px;
  justify-content: center;
  align-items: center;
  padding-top: 1px;
`;

export default ShortcutCommand;
