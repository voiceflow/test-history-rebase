import { SlotTag } from '@/components/VariableTag';
import { styled } from '@/hocs';

const StyledSlotTag = styled(SlotTag)`
  margin-right: ${(isInteraction) => (isInteraction ? 46 : 0)}px;
`;

export default StyledSlotTag;
