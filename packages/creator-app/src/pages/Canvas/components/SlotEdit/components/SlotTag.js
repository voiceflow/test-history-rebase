import { SlotTag } from '@/components/VariableTag';
import { styled } from '@/hocs';

const StyledSlotTag = styled(SlotTag)`
  margin-right: ${({ isInteraction }) => (isInteraction ? 44 : 0)}px;
`;

export default StyledSlotTag;
