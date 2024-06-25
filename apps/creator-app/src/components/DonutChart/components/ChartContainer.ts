import { styled } from '@/hocs/styled';

interface ChartContainerProps {
  size: number;
}

const ChartContainer = styled.div<ChartContainerProps>`
  position: relative;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  background: #dfe3ed;
  overflow: hidden;

  &:after {
    width: ${({ size }) => Math.floor(size / 2.06)}px;
    height: ${({ size }) => Math.floor(size / 2.06)}px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    border: ${({ size }) => Math.floor(size / 13.5)}px solid rgba(255, 255, 255, 0.24);
    border-radius: 50%;
    box-shadow:
      0 0 8px 0 rgba(0, 0, 0, 0.06),
      inset 0 0 0 ${({ size }) => size / 5}px #fff;
    content: '';
    z-index: 1;
    pointer-events: none;
  }
`;

export default ChartContainer;
