import { SearchableListItemContainer } from '@/components/SearchableList';
import { MembersContainer } from '@/components/User/components';
import { css, styled } from '@/hocs';

const ItemContainer = styled(SearchableListItemContainer)`
  user-select: none;

  ${({ isContextMenuOpen }) =>
    isContextMenuOpen &&
    css`
      &:before {
        opacity: 1;
      }
    `}

  ${MembersContainer} {
    margin-right: 0;
    margin-left: 12px;
  }
`;

export default ItemContainer;
