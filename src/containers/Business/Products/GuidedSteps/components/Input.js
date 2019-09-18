import { Input as BaseInput } from 'reactstrap';

import { css, styled } from '@/hocs';

const Input = styled(BaseInput)`
  ${({ mode }) => {
    if (mode === 'price') {
      return css`
        width: 90%;
        height: 44px;
      `;
    }
    return css`
      min-height: 45px;
      padding-left: 15px;
    `;
  }}
`;

export default Input;
