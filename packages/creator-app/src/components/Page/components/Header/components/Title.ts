import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const Title = styled(Box.Flex)<{ leftOffset?: boolean }>`
  height: 65px;
  font-weight: 700;
  color: #132144;
  font-size: 18px;
  padding-left: ${({ leftOffset }) => (leftOffset ? 32 : 0)}px;
`;

export default Title;
