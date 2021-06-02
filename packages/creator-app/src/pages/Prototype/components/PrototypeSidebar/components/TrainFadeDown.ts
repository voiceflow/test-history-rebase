import { flexCenterStyles } from '@/components/Flex';
import { styled } from '@/hocs';
import { FadeDownContainer } from '@/styles/animations';

const TrainContainer = styled(FadeDownContainer)`
  ${flexCenterStyles}
  flex: 1;
`;

export default TrainContainer;
