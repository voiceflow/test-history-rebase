import { css, styled } from '@/hocs';

export type InlineInputProps = {
  fullWidth?: boolean;
  noOverflow?: boolean;
};

const Input = styled.input<InlineInputProps>`
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

  ${({ noOverflow }) =>
    noOverflow &&
    css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
`;

export default Input;
