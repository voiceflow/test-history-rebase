import { styled, units } from '../../../../styles';
import Input from '../../../Input';
import SvgIcon from '../../../SvgIcon';

export { default as MenuHeaderWrapper } from './MenuHeaderWrapper';

export const MenuSearchIcon = styled(SvgIcon)`
  margin-right: ${units(2)}px;
`;

export const MenuInput = styled(Input)`
  flex: 1;
  padding: 12px 0;
`;

export const MenuHr = styled.hr`
  margin: 0;
`;
