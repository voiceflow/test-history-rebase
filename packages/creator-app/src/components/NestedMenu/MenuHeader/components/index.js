import Input from '@/components/Input';
import SvgIcon from '@/components/SvgIcon';
import { styled, units } from '@/hocs';

export { default as MenuHeaderWrapper } from './MenuHeaderWrapper';

export const MenuSearchIcon = styled(SvgIcon)`
  margin-right: ${units(2)}px;
`;

export const MenuInput = styled(Input)`
  padding: 12px 0;
  flex: 1;
`;

export const MenuHr = styled.hr`
  margin: 0;
`;
