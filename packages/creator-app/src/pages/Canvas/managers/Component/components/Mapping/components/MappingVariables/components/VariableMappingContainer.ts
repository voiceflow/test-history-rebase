import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs';

const VariableMappingContainer = styled(Flex)`
  position: relative;

  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

export default VariableMappingContainer;
