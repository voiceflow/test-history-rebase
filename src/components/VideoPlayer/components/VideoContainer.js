import { styled } from '@/hocs';

const VideoContainer = styled.div`
  height: ${({ height }) => height || '100%'};
  width: ${({ width }) => width || '100%'};
`;

export default VideoContainer;
