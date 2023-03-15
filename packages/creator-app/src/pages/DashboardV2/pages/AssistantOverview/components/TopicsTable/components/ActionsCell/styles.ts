import { Box } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

export const Container = styled(Box.FlexEnd)`
  ${transition('opacity')}

  width: 100%;
  padding-right: 12px;
`;
