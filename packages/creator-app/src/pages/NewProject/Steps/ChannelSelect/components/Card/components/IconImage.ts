import { css, styled } from '@/hocs';

const IconImage = styled.img<{ size: number }>`
  ${({ size }) => css`
    width: ${size}px;
    height: ${size}px;
  `}
`;

export default IconImage;
