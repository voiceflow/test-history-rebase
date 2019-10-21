import styled from 'styled-components';

import VariableTag from '@/components/VariableTag';
import { inputStyle } from '@/componentsV2/Input';

const VariableTextField = styled.div`
  ${inputStyle}

  & .public-DraftEditorPlaceholder-root,
  & .public-DraftEditorPlaceholder-hasFocus {
    position: absolute;
    z-index: 1;
    color: #8da2b5;
    pointer-events: none;
  }

  ${VariableTag} {
    margin: -3px 2px;
  }
`;

export default VariableTextField;
