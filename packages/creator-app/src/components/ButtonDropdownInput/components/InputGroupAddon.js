import { InputGroupAddon as ReactstrapInputGroupAddon } from 'reactstrap';

import { css, styled } from '@/hocs';

import { OrientationType } from '../constants';

const InputGroupAddon = styled(ReactstrapInputGroupAddon)`
  ${({ orientation }) =>
    orientation === OrientationType.RIGHT
      ? css`
          margin-right: -1px;
          border-left: 0 solid white;
        `
      : css`
          margin-left: -1px;
          border-left: 0 solid white;
        `}
`;

export default InputGroupAddon;
