import { styled } from '@/hocs';

export type LinePathProps = {
  endX: number;
  endY: number;
  color: string;
};

const LinePath = styled.line.attrs<LinePathProps>(({ endX, endY }) => ({
  x1: 0,
  y1: 0,
  x2: endX,
  y2: endY,
}))<LinePathProps>`
  stroke: ${({ color }) => color};
  stroke-width: 1px;
`;

export default LinePath;
