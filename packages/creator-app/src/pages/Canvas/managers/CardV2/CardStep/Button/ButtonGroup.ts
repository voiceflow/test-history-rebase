import { styled } from '@/hocs';

import Button from './Button';

const ButtonGroup = styled.div`
  width: 100%;

  ${Button} {
    max-width: calc(100% - 24px);
  }

  > :not(:first-of-type) ${Button} {
    margin-top: -1px;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
  }

  > :not(:last-of-type) ${Button} {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
`;

export default ButtonGroup;
