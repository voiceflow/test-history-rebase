import { inputStyle } from '@/componentsV2/Input/styles';
import { styled } from '@/hocs';

const VariableTextField = styled.div`
  ${inputStyle}

  & .public-DraftEditorPlaceholder-root,
  & .public-DraftEditorPlaceholder-hasFocus {
    position: absolute;
    z-index: 1;
    color: #8da2b5;
    pointer-events: none;
  }
`;

export default VariableTextField;
