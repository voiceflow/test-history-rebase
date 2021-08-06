import { css, styled } from '../../../styles';

export interface InlineInputProps {
  fullWidth?: boolean;
  noOverflow?: boolean;
  inline?: boolean;
}

const Input = styled.input<InlineInputProps>`
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
  padding: 0;
  background-color: inherit;
  border: none;
  border-radius: 0;
  outline: none !important;

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
