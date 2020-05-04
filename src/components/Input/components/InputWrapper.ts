import Badge from '@/components/Badge';
import { styled } from '@/hocs';

import { StyledInputProps, inputDisabled, inputStyle } from '../styles';

export type InputWrapperProps = StyledInputProps & {
  disabled?: boolean;
};

const InputWrapper = styled.div<InputWrapperProps>`
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
