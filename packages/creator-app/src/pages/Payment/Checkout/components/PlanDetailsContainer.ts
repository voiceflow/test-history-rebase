import { styled, transition } from '@/hocs/styled';

interface PlanDetailsContainerProps {
  disabled: boolean;
}

const PlanDetailsContainer = styled.div<PlanDetailsContainerProps>`
  ${transition('opacity')}
  ${({ disabled }) => disabled && 'opacity: 0.2;  pointer-events: none; '}
`;

export default PlanDetailsContainer;
