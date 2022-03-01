import { styled } from '@/hocs';
import { FadeUp } from '@/styles/animations';

const FadeUpWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  ${FadeUp}
`;

export default FadeUpWrapper;
