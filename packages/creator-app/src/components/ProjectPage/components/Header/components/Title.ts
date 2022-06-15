import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs';

const Title = styled(Box.Flex)<{ leftOffset?: boolean }>`
  height: 65px;
  font-weight: 600;
  color: #132144;
  padding-left: ${({ leftOffset }) => (leftOffset ? 32 : 0)}px;
`;

export default Title;
