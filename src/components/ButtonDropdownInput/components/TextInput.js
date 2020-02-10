import Input from '@/components/Input';
import { styled } from '@/hocs';

import { OrientationType } from '../constants';

const TextInput = styled(Input)`
  box-shadow: none !important;

  ${({ orientation }) =>
    orientation === OrientationType.RIGHT
      ? `
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
        border-left: 0 !important;
        padding-left: 10px;
      `
      : `
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
        border-right: 0 !important;
        padding-right: 10px;
      `}
`;

export default TextInput;
