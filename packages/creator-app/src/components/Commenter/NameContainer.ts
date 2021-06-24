import { Text } from '@voiceflow/ui';

import { styled } from '@/hocs';

const NameContainer = styled(Text)`
  font-weight: 600;
  margin-left: 12px;
  font-size: 15px;
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default NameContainer;
