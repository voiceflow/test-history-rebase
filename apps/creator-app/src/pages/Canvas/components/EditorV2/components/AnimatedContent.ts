import { styled } from '@/hocs/styled';
import { FadeContainer } from '@/styles/animations';

const AnimatedContent = styled(FadeContainer)`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: clip;
  overflow: hidden;
`;

export default AnimatedContent;
