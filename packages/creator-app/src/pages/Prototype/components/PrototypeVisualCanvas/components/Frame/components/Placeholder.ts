import { css, styled } from '@/hocs';

interface PlaceholderProps {
  width: number;
  height: number;
  image?: null | string;
}

const Placeholder = styled.div<PlaceholderProps>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background-color: #fff;
  ${({ image }) =>
    image &&
    css`
      background-image: url(${image});
      background-position: top;
      background-size: contain;
      background-repeat: no-repeat;
    `}
`;

export default Placeholder;
