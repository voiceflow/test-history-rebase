import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs';

const RightSection = styled(Box.FlexEnd)<{ rightOffset?: boolean }>`
  flex: 1;
  padding-right: ${({ rightOffset = true }) => (rightOffset ? 32 : 0)}px;
`;

export default RightSection;
