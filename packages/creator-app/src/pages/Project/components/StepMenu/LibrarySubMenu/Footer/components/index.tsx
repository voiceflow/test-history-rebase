import { Menu } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const StyledAction = styled(Menu.Footer.Action)`
  background-color: ${({ theme }) => theme.components.sectionV2.accentBackground2};
  border-radius: 0px 0px 8px 8px;
  height: 60px;
`;
