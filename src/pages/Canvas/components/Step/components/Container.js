import Flex from '@/components/Flex';
import { styled, units } from '@/hocs';

const Container = styled(Flex)`
  min-height: ${({ theme }) => theme.components.step.minHeight}px;
  border-radius: 5px;
  padding: ${units(2)}px ${units(2)}px ${units(2)}px 22px;
  background-color: #fff;
  box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.06),
    0 0 0 1px ${({ isActive, theme }) => (isActive ? theme.components.step.activeBorderColor : 'rgba(17, 49, 96, 0.08)')};
`;

export default Container;
