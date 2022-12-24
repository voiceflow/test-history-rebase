import { Tag } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const StyledSlotTag = styled(Tag)`
  margin-right: ${({ isInteraction }) => (isInteraction ? 44 : 0)}px;
`;

export default StyledSlotTag;
