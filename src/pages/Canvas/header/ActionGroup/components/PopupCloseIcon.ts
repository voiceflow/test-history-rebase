import SvgIcon from '@/components/SvgIcon';
import { styled, transition } from '@/hocs';

const PopupCloseIcon = styled(SvgIcon).attrs({ icon: 'close', size: 12 })`
  ${transition('color')}

  cursor: pointer;
  color: #becedc;

  & :hover {
    color: #6e849a;
  }
`;

export default PopupCloseIcon;
