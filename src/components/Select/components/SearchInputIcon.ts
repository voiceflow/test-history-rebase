import SvgIcon from '@/components/SvgIcon';
import { styled, units } from '@/hocs';

const SearchInputIcon = styled(SvgIcon)`
  position: absolute;
  right: 1px;
  padding: ${units(2)}px;
  cursor: pointer;
`;
export default SearchInputIcon;
