import { styled } from '@/hocs';

import IconButtonContainer from './IconButtonContainer';

const OutlineIconButtonContainer = styled(IconButtonContainer)`
  border: 1px solid #e2e9ec;
  box-shadow: none;

  &:hover {
    box-shadow: none;
    color: #6e849a;
    box-shadow: none;
  }

  &:active {
    background: #eef4f6cc;
    color: #6e849a;
    box-shadow: none;
    border: 1px solid #e2e9ec;
  }
`;

export default OutlineIconButtonContainer;
