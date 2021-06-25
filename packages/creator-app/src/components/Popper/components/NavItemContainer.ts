import SearchableListItemContainer, { activeStyles } from '@/components/SearchableList/components/ItemContainer';
import { styled } from '@/hocs';

const NavItemContainer = styled(SearchableListItemContainer)`
  height: 42px;
  padding: 11px 24px;

  .active & {
    ${activeStyles}
  }
`;

export default NavItemContainer;
