import { Text } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const NameContainer = styled(Text)`
  margin-left: 12px;
  font-size: 15px;
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default NameContainer;
