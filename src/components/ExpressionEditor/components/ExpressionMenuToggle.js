import { css, styled } from '@/hocs';

const ExpressionMenuToggle = styled.div`
  ${({ isOpened }) =>
    isOpened &&
    css`
      color: #132144;
      background: linear-gradient(-180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%);
      box-shadow: inset 0 0 0 1px #dfe3ed;
    `}
`;

export default ExpressionMenuToggle;
