import Flex from '@/components/Flex';
import { styled, units } from '@/hocs';

const StepItemContainer = styled(Flex)`
  position: relative;
  min-height: ${({ theme }) => theme.components.blockStep.minHeight}px;
  padding: ${units(2)}px ${units(2)}px ${units(2)}px 22px;
  width: 100%;
`;

export default StepItemContainer;
