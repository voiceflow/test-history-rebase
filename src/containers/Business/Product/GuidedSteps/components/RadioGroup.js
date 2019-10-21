import { FormGroup } from 'reactstrap';

import { styled } from '@/hocs';

const RadioButtonGroup = styled(FormGroup)`
  display: flex;

  & > * {
    margin-right: 30px;
  }
`;

export default RadioButtonGroup;
