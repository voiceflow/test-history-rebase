import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const LeftSection = styled(Box.FlexStart)<{ leftOffset?: boolean }>`
  padding-left: ${({ leftOffset = true }) => (leftOffset ? 32 : undefined)}px;
`;

export default LeftSection;
