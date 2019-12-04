import VariableInput from '@/components/VariableInput';
import { styled } from '@/hocs';

import { ORIENTATION_TYPE } from '../index';

const VariableTextInput = styled(VariableInput)`
  box-shadow: none !important;
  ${({ orientation }) =>
    orientation === ORIENTATION_TYPE.RIGHT
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

export default VariableTextInput;
