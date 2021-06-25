import { FlexCenter } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

export type MenuItemProps = {
  small?: boolean;
  isActive?: boolean;
};

export const ITEM_HEIGHT = 44;

const Item = styled(FlexCenter)<MenuItemProps>`
  ${transition('color', 'opacity')}

  width: 100%;
  height: ${({ theme, small }) => (small ? theme.components.sidebarIconMenu.smallItemHeight : theme.components.sidebarIconMenu.itemHeight)}px;
  cursor: pointer;
  color: #6e849a;
  opacity: 0.65;

  ${({ isActive }) =>
    isActive &&
    css`
      opacity: 1;
      color: #3d82e2;
      cursor: default;
      pointer-events: none;
    `}

  &:hover {
    opacity: 1;
  }
`;

export default Item;
