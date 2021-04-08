import SvgIcon from '@/components/SvgIcon';
import { styled } from '@/hocs';

const SettingsColorSelected = styled(SvgIcon).attrs({ icon: 'check', width: 8, height: 7 })`
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

export default SettingsColorSelected;
