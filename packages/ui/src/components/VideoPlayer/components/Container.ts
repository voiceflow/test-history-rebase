import { styled } from '@ui/styles';

interface ContainerProps {
  width?: string | number;
  height?: string | number;
}

const Container = styled.div<ContainerProps>`
  width: ${({ width = '100%' }) => (typeof width === 'number' ? `${width}px` : width)};
  height: ${({ height = '100%' }) => (typeof height === 'number' ? `${height}px` : height)};
`;

export default Container;
