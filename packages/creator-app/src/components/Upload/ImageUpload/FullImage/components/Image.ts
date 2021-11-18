import { css, styled } from '@/hocs';

const calculateRatio = (ratio?: number) =>
  ratio
    ? css`
        padding-bottom: ${ratio}%;
      `
    : css`
        height: 100%;
      `;

const Image = styled.div<{ src: string; ratio?: number }>`
  width: 100%;
  border-radius: 5px;
  background-size: cover;
  background-position: top center;
  min-height: 30px;
  background-image: url(${({ src }) => src});

  ${({ ratio }) => calculateRatio(ratio)}
`;
export default Image;
