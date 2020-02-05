import SvgIcon from '@/components/SvgIcon';
import { styled } from '@/hocs';

import Effect from './Effect';

const RightArrow = styled(SvgIcon)`
  margin-right: 15px;

  ${Effect}:hover > & {
    transform: translateX(50%);
    transition: all 0.1s;
  }
`;

export default RightArrow;
