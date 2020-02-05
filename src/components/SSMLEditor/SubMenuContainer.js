import { styled } from '@/hocs';

import Effect from './Effect';
import MenuContainer from './MenuContainer';

const SubMenuContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  display: none;
  width: 240px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 8px 16px rgba(17, 49, 96, 0.16), 0 0 0 rgba(17, 49, 96, 0.06);
  cursor: pointer;

  & & {
    top: 0;
    transform: translateX(-100%);
  }

  ${MenuContainer}:hover > & {
    display: block;
  }

  ${Effect}:hover > & {
    display: block;
  }
`;

export default SubMenuContainer;
