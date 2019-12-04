import { InputGroupAddon as ReactstrapInputGroupAddon } from 'reactstrap';

import { ORIENTATION_TYPE } from '@/components/ButtonDropdownInput';
import { styled } from '@/hocs';

const InputGroupAddon = styled(ReactstrapInputGroupAddon)`
  & ${({ orientation }) =>
    orientation === ORIENTATION_TYPE.RIGHT
      ? `
        margin-right: -1px;
        border-left: 0 solid white;
      `
      : `
        margin-left: -1px;
        border-left: 0 solid white;
      `}
`;

export default InputGroupAddon;
