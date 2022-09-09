import { Menu } from '@voiceflow/ui';

import { styled } from '@/hocs';

import { activeStyle } from './Item';

interface HeaderProps {
  active?: boolean;
}

const Header = styled.div<HeaderProps>`
  ${Menu.itemStyles};
  display: flex;
  border-bottom: 1px solid #eaeff4;

  input {
    user-select: auto;
    background-color: transparent;
  }

  &:hover {
    background: #fff;
  }

  ${({ active }) => active && activeStyle};
`;

export default Header;
