import { css, styled } from '@ui/styles';

export interface InlineInputProps {
  inline?: boolean;
  fullWidth?: boolean;
  noOverflow?: boolean;
}

const Input = styled.input<InlineInputProps>`
  padding: 0;
  background-color: inherit;
  border: none;
  border-radius: 0;
  outline: none !important;

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  ${({ noOverflow }) =>
    noOverflow &&
    css`
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    `}

  ${({ inline }) =>
    inline &&
    css`
      display: inline-flex;
    `}
`;

export default Input;
