import { styled } from '@/hocs/styled';
import { FadeUp } from '@/styles/animations';

const FadeUpWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  ${FadeUp}
`;

export default FadeUpWrapper;
