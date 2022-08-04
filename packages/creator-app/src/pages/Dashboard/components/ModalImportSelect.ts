import { Select } from '@voiceflow/ui';

import { styled } from '@/hocs';

const ImportSelect = styled(Select)`
  input {
    color: black !important;
  }
`;

export default ImportSelect as typeof Select;
