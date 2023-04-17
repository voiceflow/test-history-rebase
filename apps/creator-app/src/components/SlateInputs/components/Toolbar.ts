import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const Toolbar = styled(Flex)`
  gap: 4px;
  width: calc(100% + 32px);
  height: 42px;
  margin: 12px -16px -10px -16px;
  padding: 0 12px;
  background-color: #fdfdfd;
  border-top: 1px solid #eaeff4;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`;

export default Toolbar;
