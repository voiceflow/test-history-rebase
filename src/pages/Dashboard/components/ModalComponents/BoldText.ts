import { css, styled } from '@/hocs';

type BoldTextProps = {
  fontSize?: number;
};

const BoldText = styled.span<BoldTextProps>`
  font-weight: 600;

  ${({ fontSize }) =>
    fontSize &&
    css`
      font-size: ${fontSize}px;
    `}
`;

export default BoldText;
