import Flex from '@/components/Flex';
import { styled } from '@/hocs';

const Header = styled(Flex as any)`
  font-size: 15px;
  font-weight: 600;
  color: #132144;
  margin-bottom: 6px;

  span {
    margin-right: 12px;
  }
`;

export default Header;
