import { css, styled } from '@ui/styles';

interface BoldTextProps {
  fontSize?: number;
}

const BoldText = styled.span<BoldTextProps>`
  font-weight: 600;

  ${({ fontSize }) =>
    fontSize &&
    css`
      font-size: ${fontSize}px;
    `}
`;

export default BoldText;
