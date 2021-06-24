import { SvgIcon } from '@voiceflow/ui';

import { styled, transition } from '@/hocs';

const PopupCloseIcon = styled(SvgIcon).attrs({ icon: 'close', size: 12 })`
  ${transition('color')}

  cursor: pointer;
  color: #becedc;

  & :hover {
    color: #8da2b5;
  }

  transition: color 0.15s ease;
`;

export default PopupCloseIcon;
