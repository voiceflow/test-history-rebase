import { cardStyles } from '@/componentsV2/Card';
import { styled } from '@/hocs';

const MAX_VISIBLE_ITEMS = 7.5;

const MenuContainer = styled.ul`
  ${cardStyles}

  max-height: ${({ theme }) => theme.components.menuItem.height * MAX_VISIBLE_ITEMS}px;
  min-width: 100px;
  ${({ fullWidth }) => (fullWidth ? '' : 'max-width: 400px;')}
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 8px 0;
  border-radius: 5px;
  background: ${({ theme }) => theme.color.gradient[0]};
  color: #132144;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
  font-size: 15px;
  line-height: 18px;
  list-style: none;
  overflow: hidden;
  animation: fadein 0.15s ease, movein 0.15s ease, scaleY 0.1s ease;
  transform-origin: top;
`;

export default MenuContainer;
