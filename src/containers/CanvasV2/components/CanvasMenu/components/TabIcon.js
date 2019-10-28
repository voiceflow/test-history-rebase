import SvgIcon from '@/components/SvgIcon';
import { styled } from '@/hocs';

const TabIcon = styled(SvgIcon)`
  display: block;
  padding: ${({ theme }) => theme.unit * 1.5}px;
  cursor: pointer;
  color: ${({ active }) => (active ? '#233050' : '#8da2b5')};
  box-sizing: unset;

  &:hover {
    color: #233050;
  }
`;

export default TabIcon;
