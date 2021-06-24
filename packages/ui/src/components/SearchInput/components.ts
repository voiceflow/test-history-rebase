import { styled, units } from '../../styles';
import SvgIcon from '../SvgIcon';

// eslint-disable-next-line import/prefer-default-export
export const SearchInputIcon = styled(SvgIcon)`
  position: absolute;
  right: 1px;
  padding: ${units(2)}px ${units(2)}px ${units(2)}px ${units()}px;
  cursor: pointer;
`;
