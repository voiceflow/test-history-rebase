import DragPlaceholder from '@/components/DragPlaceholder';
import { styled } from '@/hocs';

const StepPlaceholder = styled(DragPlaceholder)`
  height: ${({ theme }) => theme.components.blockStep.minHeight}px;
  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgba(19, 33, 68, 0.08), 0 0 0 1px rgba(19, 33, 68, 0.06);
  background-color: #fff;
`;

export default StepPlaceholder;
