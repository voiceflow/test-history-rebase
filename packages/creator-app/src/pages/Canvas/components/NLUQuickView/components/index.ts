import { Input, ThemeColor } from '@voiceflow/ui';

import { styled } from '@/hocs';
import THEME from '@/styles/theme';

export const TitleInput = styled(Input)`
  border-radius: 0;
  border: none !important;
  box-shadow: none !important;
  padding: 0;
  height: 23px;
  min-height: 0px;
  min-width: 300px;
  color: ${THEME.colors[ThemeColor.PRIMARY]};
  font-weight: 600;
  min-height: 23px;
`;
