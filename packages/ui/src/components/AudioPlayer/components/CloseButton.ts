import SvgIcon from '@ui/components/SvgIcon';
import { styled, transition } from '@ui/styles';

const CloseButton = styled(SvgIcon)`
  ${transition('color')}
  position: absolute;
  top: 10px;
  right: 10px;
  color: #becedc;

  :hover {
    color: #8da2b5;
  }
`;

export default CloseButton;
