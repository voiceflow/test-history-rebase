import Badge from '@/componentsV2/Badge';
import { styled } from '@/hocs';

import { inputDisabled, inputStyle } from '../styles';

const InputWrapper = styled.div`
  ${inputStyle}

  display: flex;
  align-items: center;
  position: relative;

  &[disabled] {
    ${inputDisabled}
    input {
      ${inputDisabled}
    }
  }

  & > * {
    margin-right: 12px;
    :last-child {
      margin-right: 0;
    }
  }

  & > ${Badge}:last-child {
    margin-right: -6px;
  }
`;

export default InputWrapper;
