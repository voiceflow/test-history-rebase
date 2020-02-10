import { styled, transition } from '@/hocs';

const PlanDetailsContainer = styled.div`
  ${transition('opacity')}
  ${({ disabled }) => disabled && 'opacity: 0.2;  pointer-events: none; '}
`;

export default PlanDetailsContainer;
