import styled from 'styled-components';

import { cardStyles } from '@/componentsV2/Card';

const MAX_VISIBLE_ITEMS = 7.5;

const MenuContainer = styled.ul`
  ${cardStyles}

  max-height: ${({ theme }) => theme.components.menuItem.height * MAX_VISIBLE_ITEMS}px;
  min-width: 100px;
  max-width: 400px;
  margin: 0;
  padding: 8px 0;
  border-radius: 5px;
  background: ${({ theme }) => theme.color.gradient[0]};
  color: #132144;
  box-shadow: 0px 8px 16px rgba(17, 49, 96, 0.16), 0px 0px 0px rgba(17, 49, 96, 0.06);
  font-size: 15px;
  line-height: 18px;
  list-style: none;
`;

export default MenuContainer;
