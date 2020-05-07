import SvgIcon from '@/components/SvgIcon';
import { styled, transition } from '@/hocs';

const LockIcon = styled(SvgIcon)`
  display: inline-block;
  cursor: pointer;

  color: ${({ locked }) => (locked ? '#95a6bd' : '#becedc')};
  ${transition('color')}

  &:hover {
    color: #6e849a;
  }
`;

export default LockIcon;
