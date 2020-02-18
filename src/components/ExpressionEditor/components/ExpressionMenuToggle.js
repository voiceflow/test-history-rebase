import { css, styled } from '@/hocs';

const ExpressionMenuToggle = styled.div`
  ${({ isOpened }) =>
    isOpened &&
    css`
      color: #132144;
      box-shadow: inset 0 0 0 1px #dfe3ed;
    `}
`;

export default ExpressionMenuToggle;
