import Flex from '@/components/Flex';
import { styled } from '@/hocs';

import Section from './StepSection';

export type StepContainerProps = {
  isActive?: boolean;
};

const StepContainer = styled(Flex)<StepContainerProps>`
  flex-direction: column;
  min-height: ${({ theme }) => theme.components.blockStep.minHeight}px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.06),
    0 0 0 1px ${({ isActive, theme }) => (isActive ? theme.components.blockStep.activeBorderColor : 'rgba(17, 49, 96, 0.08)')};

  ${Section}:not(:first-of-type) {
    border-top: 1px solid #eaeff4;
  }
`;

export default StepContainer;
