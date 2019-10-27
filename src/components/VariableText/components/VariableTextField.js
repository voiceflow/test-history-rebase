import styled from 'styled-components';

import { inputStyle } from '@/componentsV2/Input';

const VariableTextField = styled.div`
  ${inputStyle}
  line-height: 25px;

  & .public-DraftEditorPlaceholder-root,
  & .public-DraftEditorPlaceholder-hasFocus {
    position: absolute;
    z-index: 1;
    color: #8da2b5;
    pointer-events: none;
  }
`;

export default VariableTextField;
