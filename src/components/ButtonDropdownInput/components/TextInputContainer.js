import { VariableTextContainer } from '@/components/VariableText';
import { styled } from '@/hocs';

const TextInputContainer = styled.div`
  flex-grow: 1;
  overflow: auto;

  ${VariableTextContainer} {
    position: static;
  }
`;

export default TextInputContainer;
