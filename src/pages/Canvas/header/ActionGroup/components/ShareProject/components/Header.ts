import { css, styled } from '@/hocs';

const Header = styled.div<{ marginBottom?: number; secondary?: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: #132144;
  margin-bottom: 6px;

  span {
    margin-right: 12px;
    vertical-align: middle;
  }

  ${({ marginBottom }) =>
    marginBottom &&
    css`
      margin-bottom: ${marginBottom}px;
    `}

  ${({ secondary }) =>
    secondary &&
    css`
      color: #62778c;
    `}
`;

export default Header;
