import { styled } from '@/hocs/styled';

const VideoContainer = styled.div<{ width?: string | number; height?: string | number }>`
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width) ?? '100%'};
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height) ?? '100%'};
`;

export default VideoContainer;
