import AutosizeInput from 'react-input-autosize';

import { styled } from '../../../styles';

const TagsInput = styled(AutosizeInput)`
  border: none;
  display: inline-flex;

  input {
    border: none;
    padding: 4px;
  }
`;

export default TagsInput;
