import { FlexCenter } from '@voiceflow/ui';

import { styled, units } from '@/hocs/styled';

const StatusContainer = styled(FlexCenter)`
  max-width: 100%;

  &:not(:last-child) {
    margin-right: ${units(2)}px;
  }
`;
export default StatusContainer;
