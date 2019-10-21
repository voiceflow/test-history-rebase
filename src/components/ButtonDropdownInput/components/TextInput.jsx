import VariableInput from '@/components/VariableInput';
import { styled } from '@/hocs';

const TextInput = styled(VariableInput)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: 0 !important;
  box-shadow: none !important;
  padding-left: 10px;
`;

export default TextInput;
