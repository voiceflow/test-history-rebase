import { styled } from '@/hocs';

export type RectanglePathProps = {
  width: number;
  height: number;
  isCircle: boolean;
  borderColor: string;
  backgroundColor: string;
  borderRadius: number | null;
};

const RectanglePath = styled.rect.attrs<RectanglePathProps>(({ width, height, borderRadius, isCircle }) => ({
  x: 0,
  y: 0,
  width,
  height,
  rx: isCircle ? width : borderRadius,
  ry: isCircle ? height : borderRadius,
}))<RectanglePathProps>`
  stroke-width: 1px;

  stroke: ${({ borderColor }) => borderColor};
  fill: ${({ backgroundColor }) => backgroundColor};
`;

export default RectanglePath;
