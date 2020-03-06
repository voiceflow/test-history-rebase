import Flex from '@/components/Flex';
import { styled } from '@/hocs';

const SearchContainer = styled(Flex)`
  position: sticky;
  bottom: 0;
  height: 56px;
  border-top: 1px solid #e2e9ec;
  background-color: #fff;
  z-index: 1;
`;

export default SearchContainer;
