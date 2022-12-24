import { Input, InputVariant } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const EditableTextInput = styled(Input).attrs({ variant: InputVariant.INLINE })`
  height: 22px;
  margin-top: 4px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default EditableTextInput;
