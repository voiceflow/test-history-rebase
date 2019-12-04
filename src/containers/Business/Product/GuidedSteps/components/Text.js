import { css, styled } from '@/hocs';

const Text = styled.span`
  padding: 0 10px;
  white-space: nowrap;
  color: #62778c;

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
