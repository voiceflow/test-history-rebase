import SvgIcon from '@/components/SvgIcon';
import { styled, units } from '@/hocs';

export { default as SelectItem } from './SelectItem';
export { default as SearchInput } from './SearchInput';
export { default as SelectWrapper } from './SelectWrapper';
export { default as InlineInputValue } from './InlineInputValue';
export { default as PrefixContainer } from './PrefixContainer';

export const SearchInputIcon = styled(SvgIcon)`
  position: absolute;
  right: 1px;
  padding: ${units(2)}px;
  cursor: pointer;
`;
