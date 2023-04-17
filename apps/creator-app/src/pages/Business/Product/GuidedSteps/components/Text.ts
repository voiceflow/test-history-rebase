import { css, styled } from '@/hocs/styled';

export interface TextProps {
  small?: boolean;
  error?: boolean;
  noPadding?: boolean;
}

const Text = styled.span<TextProps>`
  padding: 0 10px;
  color: #62778c;
  white-space: nowrap;

  ${({ small }) =>
    small &&
    css`
      font-size: 11px;
    `};

  ${({ error }) =>
    error &&
    css`
      color: #dc3545;
    `};

  ${({ noPadding }) =>
    noPadding &&
    css`
      padding: 0;
    `};
`;

export default Text;
