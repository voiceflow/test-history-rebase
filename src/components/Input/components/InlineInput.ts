import { css, styled } from '@/hocs';

export type InputProps = {
  fullWidth?: boolean;
};

const Input = styled.input<InputProps>`
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  outline: none !important;
  background-color: inherit;
  border: none;
  padding: 0;
  border-radius: 0;
`;

export default Input;
