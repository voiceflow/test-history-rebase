// eslint-disable-next-line no-unused-vars
import { styled, transition } from '@/hocs';

const MenuTooltipContainer = styled.div`
  position: absolute;
  height: 20px;
  width: 20px;
  border-radius: 50%
  padding: 2px;
  right: 12px;
  cursor: pointer;
  text-align: center;
  ${transition()};
  
   &:hover {
    background-color: #fff;
   }
`;

export default MenuTooltipContainer;
