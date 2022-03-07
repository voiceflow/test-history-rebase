import { Select } from '@voiceflow/ui';

import { styled } from '@/hocs';

const SelectContainer = styled(Select)`
  input {
    text-overflow: ellipsis;
  }
` as typeof Select;

export default SelectContainer;
