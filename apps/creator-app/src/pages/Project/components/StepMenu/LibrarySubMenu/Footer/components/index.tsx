import { Menu } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

export const StyledAction = styled(Menu.Footer.Action).attrs({ borderLeftStyle: false })`
  ${transition('background-color')}
  background-color: ${({ theme }) => theme.components.sectionV2.accentBackground};

  border-radius: 0px 0px 8px 8px;
  height: 60px;
`;
