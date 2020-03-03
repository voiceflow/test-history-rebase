import { FlexApart } from '@/components/Flex';
import { MembersContainer } from '@/components/User/components';
import { css, styled, transition } from '@/hocs';

const ItemContainer = styled(FlexApart)`
  width: 100%;
  height: 42px;
  padding: 0 14px 0 18px;
  cursor: pointer;
  position: relative;
  font-size: 13px;
  user-select: none;

  &:before {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background-image: linear-gradient(to bottom, rgba(238, 244, 246, 0.85), #eef4f6);
    border-top: 1px solid rgba(238, 244, 246, 0);
    border-bottom: 1px solid rgba(238, 244, 246, 0);
    opacity: 0;
    z-index: -1;

    ${transition('opacity', 'border-color')};

    content: '';
  }

  &:hover&:before {
    opacity: 1;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      cursor: default;

      &:before {
        border-color: #dfe3ed;
        opacity: 1;
      }
    `}
  
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
