import { SvgIcon } from '@voiceflow/ui';

import { styled } from '@/hocs';

const SettingsColorSelected = styled(SvgIcon).attrs({ icon: 'check', width: 8, height: 7 })`
  position: absolute;
  top: 50%;
  left: 50%;
  color: #fff;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

export default SettingsColorSelected;
