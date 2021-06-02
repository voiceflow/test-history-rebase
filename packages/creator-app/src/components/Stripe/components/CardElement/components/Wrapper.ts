import { inputStyle, StyledInputProps } from '@/components/Input/styles';
import { css, styled } from '@/hocs';

type WrapperProps = StyledInputProps & {
  disabled?: boolean;
};

const Wrapper = styled.div<WrapperProps>`
  ${inputStyle}
  border: 1px solid ${({ borderColor }) => borderColor} !important;
  box-sizing: border-box;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}

  .StripeElement {
    box-sizing: unset;
    width: unset;
    padding: unset;
    border: unset;
    border-radius: unset;
    box-shadow: unset;
    transition: unset;
    height: 20px;

    &.StripeElement--focus {
      color: unset !important;
      border: unset !important;
      box-shadow: unset !important;
    }
  }
`;

export default Wrapper;
