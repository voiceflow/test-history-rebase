import { BoxFlex } from '@voiceflow/ui';

import { styled } from '@/hocs';
import { FadeDown } from '@/styles/animations';

const SettingsContent = styled(BoxFlex)`
  ${FadeDown}

  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
  border-radius: 5px;
  overflow: hidden;
  background-color: #fff;
`;

export default SettingsContent;
