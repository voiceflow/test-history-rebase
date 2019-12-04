import SvgIcon from '@/components/SvgIcon';
import { User } from '@/components/User/User';
import Dropdown from '@/componentsV2/Dropdown';
import { FlexApart } from '@/componentsV2/Flex';
import { MenuItem } from '@/componentsV2/Menu';
import { styled } from '@/hocs';

export const Container = styled(FlexApart)`
  border-bottom: 1px solid #eaeff4;
  padding: 16px 32px 16px 0px;
  font-size: 15px;
`;

export const UserIcon = styled(User)`
  display: inline-block;
  margin-right: 16px;
  margin-left: 4px;
`;

export const PermissionDropdown = styled(Dropdown)`
  font-size: 12px;
  color: #62778c;
`;

export const DropdownIcon = styled(SvgIcon)`
  display: inline-block;
  margin-left: 6px;
`;

export const PermissionsDropdownButton = styled.div`
  color: #62778c;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
`;

export const MemberName = styled.div`
  color: ${({ pending }) => (pending ? '#8da2b5' : 'auto')};
  display: inline-block;
`;

export const DropdownItem = styled(MenuItem)``;
